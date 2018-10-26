import { TestBed } from '@angular/core/testing';
import { SessionsSearchComponent } from './sessions-search.component';
import { StoreModule, Store } from '@ngrx/store';
import * as fromHearingParts from '../../../hearing-part/reducers/index';
import * as sessionReducers from '../../reducers/index';
import * as judgesReducers from '../../../judges/reducers/index';
import * as sessionTypeReducer from '../../../core/reference/reducers/session-type.reducer';
import * as caseTypeReducer from '../../../core/reference/reducers/case-type.reducer';
import * as roomTypeReducer from '../../../core/reference/reducers/room-type.reducer';
import * as hearingTypeReducer from '../../../core/reference/reducers/hearing-type.reducer';
import * as noteReducer from '../../../notes/reducers/index';
import { SessionsFilterService } from '../../services/sessions-filter-service';
import { MatDialog } from '@angular/material';
import * as hearingPartActions from '../../../hearing-part/actions/hearing-part.action';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';
import * as roomActions from '../../../rooms/actions/room.action';
import * as judgeActions from '../../../judges/actions/judge.action';
import * as referenceDataActions from '../../../core/reference/actions/reference-data.action';
import * as sessionActions from './../../actions/session.action';
import * as notesActions from './../../../notes/actions/notes.action';
import { SessionType } from '../../../core/reference/models/session-type';
import moment = require('moment');
import { SessionViewModel } from '../../models/session.viewmodel';
import { SessionFilters } from '../../models/session-filter.model';

let component: SessionsSearchComponent
const matDialogSpy: jasmine.SpyObj<MatDialog> =
    jasmine.createSpyObj('MatDialog', ['open'])
let storeSpy;
let store: Store<any>;

const mockedSessionType: SessionType[] = [{code: 'session-type-code', description: 'session-type-desc'}]

  const svm: SessionViewModel = {
    id: 'some-id',
    duration: 6000,
    start: moment(),
    sessionType: mockedSessionType[0],
    person: undefined,
    room: undefined,
    hearingParts: undefined,
    jurisdiction: undefined,
    version: 0,
    allocated: undefined,
    utilization: undefined,
    available: undefined,
    notes: []
}
const svms = [svm];

describe('SessionsSearchComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({}),
                StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
                StoreModule.forFeature('sessions', sessionReducers.reducers),
                StoreModule.forFeature('judges', judgesReducers.reducers),
                StoreModule.forFeature('sessionTypes', sessionTypeReducer.reducer),
                StoreModule.forFeature('caseTypes', caseTypeReducer.reducer),
                StoreModule.forFeature('roomTypes', roomTypeReducer.reducer),
                StoreModule.forFeature('hearingTypes', hearingTypeReducer.reducer),
                StoreModule.forFeature('notes', noteReducer.reducers),
            ],
            providers: [
                SessionsFilterService,
                SessionsStatisticsService,
                { provide: MatDialog, useValue: matDialogSpy },
                Store,
                SessionsSearchComponent,
            ]
        });
        store = TestBed.get(Store);
        store.dispatch(new hearingPartActions.SearchComplete([]))
        store.dispatch(new roomActions.GetComplete([]))
        store.dispatch(new judgeActions.GetComplete([]))
        store.dispatch(new referenceDataActions.GetAllSessionTypeComplete([]))
        store.dispatch(new referenceDataActions.GetAllRoomTypeComplete([]))
        store.dispatch(new referenceDataActions.GetAllCaseTypeComplete([]))
        store.dispatch(new referenceDataActions.GetAllHearingTypeComplete([]))
        store.dispatch(new sessionActions.SearchComplete([]))
        store.dispatch(new notesActions.UpsertMany([]))
        component = TestBed.get(SessionsSearchComponent);
    })

    describe('constructor', () => {
        it('should be defined', () => {
            expect(component).toBeDefined();
        });

        it('should set start and end date', () => {
            expect(component.startDate).toBeDefined()
            expect(component.endDate).toBeDefined()
        });
    });

    describe('ngOnInit', () => {
        [
            { actionName: 'Session.SearchForDates', instance: sessionActions.SearchForDates },
            { actionName: 'HearingPart.Search', instance: hearingPartActions.Search },
            { actionName: 'RoomActions.Get', instance: roomActions.Get },
            { actionName: 'JudgeActions.Get', instance: judgeActions.Get }
        ].forEach(pair => {
            it(`should dispatch ${pair.actionName}`, () => {
                storeSpy = spyOn(store, 'dispatch').and.callThrough();
                component.ngOnInit()
                const actions = storeSpy.calls.allArgs()
                    .filter(arg => arg[0] instanceof pair.instance);
                expect(actions.length).toEqual(1);
            });
        });
    });

    describe('openAmendDialog', () => {
        it('should open dialog', () => {
            component.openAmendDialog(svm)
            expect(matDialogSpy.open).toHaveBeenCalled()
        })

        it('should open dialog with data', () => {
            component.openAmendDialog(svm)
            matDialogSpy.open.calls.first()
            const passedData = matDialogSpy.open.calls.first().args[1].data
            expect(passedData.notes).toEqual(svm.notes)
            expect(passedData.sessionTypes).toEqual(component.sessionTypes)
        })
    })

    describe('filterSessions', () => {
        it('should return all session when filter is undefined', () => {
            expect(component.filterSessions(svms, undefined)).toBe(svms)
        });

        it('when filter startDate is different than component.startDate it should search for session with new dates', () => {
            storeSpy = spyOn(store, 'dispatch').and.callThrough();
            const newStartDate = component.startDate.clone().add(1, 'day')
            const newEndDate = component.endDate.clone().add(1, 'day')

            const sessionFilter: SessionFilters = {
                startDate: newStartDate,
                endDate: newEndDate
            } as SessionFilters

            expect(component.filterSessions([], sessionFilter)).toEqual([])
            expect(storeSpy.calls.mostRecent().args[0] instanceof sessionActions.SearchForDates).toBeTruthy()
            expect(component.startDate).toEqual(newStartDate)
            expect(component.endDate).toEqual(newEndDate)
        });
    })
});

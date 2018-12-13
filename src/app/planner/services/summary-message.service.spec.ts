import { SessionCalendarViewModel } from './../../sessions/models/session.viewmodel';
import { UpdateEventModel } from './../../common/ng-fullcalendar/models/updateEventModel';
import { Separator } from './../../core/callendar/transformers/data-with-simple-resource-transformer';
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import * as judgesReducers from '../../judges/reducers';
import * as judgeActions from '../../judges/actions/judge.action';
import * as sessionReducers from '../../sessions/reducers';
import * as roomActions from '../../rooms/actions/room.action';
import { SummaryMessageService } from './summary-message.service';
import * as moment from 'moment';
import { CalendarEventSessionViewModel } from '../types/calendar-event-session-view-model.type';
import { Room } from '../../rooms/models/room.model';

let store: Store<judgesReducers.State>;
let summaryMessageService: SummaryMessageService;
let roomA = {id: 'roomA-id', name: 'roomA-name', roomTypeCode: 'codea'}
let roomB = {id: 'roomB-id', name: 'roomB-name', roomTypeCode: 'codeb'}
let personA = {id: 'personA-id', name: 'personA-name'}
let personB = {id: 'personB-id', name: 'personB-name'}
const zeroDuration = moment.duration(0, 'minutes');

describe('SummaryMessageService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
              StoreModule.forRoot({}),
              StoreModule.forFeature('sessions', sessionReducers.reducers),
              StoreModule.forFeature('judges', judgesReducers.reducers),
            ],
            providers: [
                SummaryMessageService,
            ]
          });
          summaryMessageService = TestBed.get(SummaryMessageService);
          store = TestBed.get(Store);
    });

    describe('When event details are undefined', () => {
        it('should build msg', () => {
            const custom = event();
            custom.detail.event = undefined

            summaryMessageService.buildSummaryMessage(custom).subscribe(msg => {
                expect(msg).toEqual('Hearing part has been listed!');
            });
        })
    });

    describe('When only time has changed', () => {
        it('should return null', (done) => {
            const newResourceString = roomResourceString(roomA.id)
            const eventWithPositiveDuration = event(moment.duration(30, 'minutes'), newResourceString, roomA)
            summaryMessageService.buildSummaryMessage(eventWithPositiveDuration)
              .subscribe(summaryMsg => {
                  expect(summaryMsg).toBeNull()
                  done()
              })
        });
    });

    describe('When judge has been assigned', () => {
        it(`should return message that 'given judge has been assigned'`, (done) => {
            store.dispatch(new judgeActions.GetComplete([personA]));
            const newResourceString = personResourceString(personA.id)
            const eventWithChangedPerson = event(zeroDuration, newResourceString, null, personB)
            summaryMessageService.buildSummaryMessage(eventWithChangedPerson)
              .subscribe(summaryMsg => {
                  expect(summaryMsg).toEqual(`${personA.name} has been assigned`)
                  done()
              })
        });
    });

    describe('When judge has been unassigned', () => {
        it(`should return message that 'given judge has been unassigned'`, (done) => {
            const newResourceString = personResourceString('empty')
            const eventWithChangedPerson = event(zeroDuration, newResourceString, null, personA)
            summaryMessageService.buildSummaryMessage(eventWithChangedPerson)
              .subscribe(summaryMsg => {
                  expect(summaryMsg).toEqual(`${personA.name} has been unassigned`)
                  done()
              })
        });
    });

    describe('When room has been assigned', () => {
        it(`should return message that 'given room has been assigned'`, (done) => {
            store.dispatch(new roomActions.GetComplete([roomA]));
            const newResourceString = roomResourceString(roomA.id)
            const eventWithChangedPerson = event(zeroDuration, newResourceString, null, roomB)
            summaryMessageService.buildSummaryMessage(eventWithChangedPerson)
              .subscribe(summaryMsg => {
                  expect(summaryMsg).toEqual(`${roomA.name} has been assigned`)
                  done()
              })
        });
    });

    describe('When room has been unassigned', () => {
        it(`should return message that 'given room has been unassigned'`, (done) => {
            const newResourceString = roomResourceString('empty')
            const eventWithChangedPerson = event(zeroDuration, newResourceString, roomA)
            summaryMessageService.buildSummaryMessage(eventWithChangedPerson)
              .subscribe(summaryMsg => {
                  expect(summaryMsg).toEqual(`${roomA.name} has been unassigned`)
                  done()
              })
        });
    });
});

function roomResourceString(roomId): string {
    return `room${Separator}${roomId}`
}

function personResourceString(personId): string {
    return `person${Separator}${personId}`
}

function event(delta?: moment.Duration, resourceId?: string,
    room?: {id: string, name: string},
    person?: {id: string, name: string}): CustomEvent<UpdateEventModel<SessionCalendarViewModel>> {

    const sessionCalendarViewModel = {
        resourceId,
        room: room as Room,
        person,
        title: '',
        start: undefined,
        end: undefined,
        id: 'someId',
        hearingParts: [],
        sessionType: undefined,
        version: 1
    } as SessionCalendarViewModel

    const updateEvent = { event: sessionCalendarViewModel, delta } as UpdateEventModel<SessionCalendarViewModel>
    const customEvent: CalendarEventSessionViewModel = new CustomEvent<UpdateEventModel<SessionCalendarViewModel>>('someEvent', {
        bubbles: false,
        detail: updateEvent
    });

    return customEvent;
}

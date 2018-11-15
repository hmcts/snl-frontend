import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as ReferenceDataActions from '../../../core/reference/actions/reference-data.action';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfig } from '../../../app.config';
import { ReferenceDataEffects } from './reference-data.effects';
import { ReferenceDataService } from '../services/reference-data.service';

const mockedAppConfig = { getApiUrl: () => 'https://google.co.uk' };

describe('Reference Data Effects', () => {
    let effects: ReferenceDataEffects;
    let actions: Observable<any>;
    let refDataService: ReferenceDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                ReferenceDataEffects,
                { provide: AppConfig, useValue: mockedAppConfig},
                provideMockActions(() => actions),
                ReferenceDataService
            ],
        });

        effects = TestBed.get(ReferenceDataEffects);
        refDataService = TestBed.get(ReferenceDataService);
    });

    describe('When getting casetypes', () => {
        it('with it should call service and call  \'GetAllCaseTypeComplete\' action', () => {
            spyOn(refDataService, 'fetchCaseTypes').and.returnValue(Observable.of([]));

            const action = new ReferenceDataActions.GetAllCaseType()
            const expectedAction = new ReferenceDataActions.GetAllCaseTypeComplete([])

            actions = hot('--a-', { a: action });
            const expected = cold('--b', { b: expectedAction });

            expect(effects.getCaseTypes$).toBeObservable(expected);
        });

        it('with it should call service and call  \'GetAllHearingTypeComplete\' action', () => {
            spyOn(refDataService, 'fetchHearingTypes').and.returnValue(Observable.of([]));

            const action = new ReferenceDataActions.GetAllHearingType()
            const expectedAction = new ReferenceDataActions.GetAllHearingTypeComplete([])

            actions = hot('--a-', { a: action });
            const expected = cold('--b', { b: expectedAction });

            expect(effects.getHearingTypes$).toBeObservable(expected);
        });

        it('with it should call service and call  \'GetAllSessionTypeComplete\' action', () => {
            spyOn(refDataService, 'fetchSessionTypes').and.returnValue(Observable.of([]));

            const action = new ReferenceDataActions.GetAllSessionType()
            const expectedAction = new ReferenceDataActions.GetAllSessionTypeComplete([])

            actions = hot('--a-', { a: action });
            const expected = cold('--b', { b: expectedAction });

            expect(effects.getSessionTypes$).toBeObservable(expected);
        });

        it('with it should call service and call  \'GetAllRoomTypeComplete\' action', () => {
            spyOn(refDataService, 'fetchRoomTypes').and.returnValue(Observable.of([]));

            const action = new ReferenceDataActions.GetAllRoomType()
            const expectedAction = new ReferenceDataActions.GetAllRoomTypeComplete([])

            actions = hot('--a-', { a: action });
            const expected = cold('--b', { b: expectedAction });

            expect(effects.getRoomTypes$).toBeObservable(expected);
        });
    });
});

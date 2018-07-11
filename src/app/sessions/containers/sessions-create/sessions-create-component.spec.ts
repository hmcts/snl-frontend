import * as sessionReducers from './../../reducers/index';
import * as judgesReducers from './../../../judges/reducers/index';
import { AngularMaterialModule } from './../../../../angular-material/angular-material.module';
import { select, Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';
import * as fromHearingParts from '../../../hearing-part/reducers/index';
import { HearingPartModificationService } from '../../../hearing-part/services/hearing-part-modification-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionDialogComponent } from '../../components/transaction-dialog/transaction-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { SessionEffects } from '../../effects/session.effects';
import { RoomEffects } from '../../../rooms/effects/room.effects';
import { JudgeEffects } from '../../../judges/effects/judge.effects';
import { CoreModule } from '../../../core/core.module';
import { SessionModule } from '../../session.module';
import { ProblemsModule } from '../../../problems/problems.module';
import { SessionsCreateComponent } from './sessions-create.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../../app.config';
import * as moment from 'moment';
import { SessionCreate } from '../../models/session-create.model';
import { State } from '../../reducers';
import { ProblemEffects } from '../../../problems/effects/problem.effects';
import { CommitTransaction, RollbackTransaction } from '../../actions/transaction.action';

let httpMock: HttpTestingController;
let component: SessionsCreateComponent;
let storeSpy: jasmine.Spy;
let store: Store<State>;

describe('SessionsCreateComponent', () => {
    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [
                AngularMaterialModule,
                FormsModule,
                CoreModule,
                SessionModule,
                ProblemsModule,
                StoreModule.forRoot({}),
                StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
                StoreModule.forFeature('sessions', sessionReducers.reducers),
                StoreModule.forFeature('judges', judgesReducers.reducers),
                EffectsModule.forRoot([]),
                EffectsModule.forFeature([SessionEffects, JudgeEffects, RoomEffects, ProblemEffects]),
                BrowserAnimationsModule,
                HttpClientTestingModule
            ],
            providers: [SessionsCreateComponent, SessionsStatisticsService, HearingPartModificationService,
                { provide: AppConfig, useValue: mockedAppConfig }, Actions],
            declarations: []
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [TransactionDialogComponent]
            }
        });

        component = TestBed.get(SessionsCreateComponent);
        httpMock = TestBed.get(HttpTestingController);

        store = TestBed.get(Store);
        storeSpy = spyOn(store, 'dispatch').and.callThrough();
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('When created a session', () => {

        it('and accepted the problems the session should appear in state', () => {
            let sessionId = 'a42c68ac-a0e6-4f11-8e58-1fd3d7af1def';
            let session = {
                userTransactionId: undefined,
                id: sessionId,
                start: moment().toDate(),
                duration: 1800,
                roomId: null,
                personId: null,
                caseType: 'casetype',
            } as SessionCreate;

            component.create(session);

            let transactionId = storeSpy.calls.all()[0].args[0].payload.id; // retrieve transactionId passed into one of the actions

            httpMock.expectOne(getCreateSessionUrl()).flush(getTransactionStartedResponse(transactionId));
            httpMock.expectOne(getGetProblemsUrl(transactionId)).flush([]);

            store.dispatch(new CommitTransaction(transactionId));

            httpMock.expectOne(getCommitTransactionUrl(transactionId)).flush(getTransactionCommittedResponse(transactionId));
            httpMock.expectOne(getSessionByIdUrl(sessionId)).flush(getCreatedSessionResponse(sessionId));
            httpMock.expectOne(getGetHearingPartsUrl()).flush([]);

            store.pipe(select(state => state.sessions.sessions.entities[sessionId])).subscribe(sess => {
                expect(sess.id).toEqual(sessionId);
            }).unsubscribe();
        });

        it('and rolled back the transaction the session should not appear in state', () => {
            let sessionId = 'a42c68ac-a0e6-4f11-8e58-1fd3d7af1def';
            let session = {
                userTransactionId: undefined,
                id: sessionId,
                start: moment().toDate(),
                duration: 1800,
                roomId: null,
                personId: null,
                caseType: 'casetype',
            } as SessionCreate;

            component.create(session);

            let transactionId = storeSpy.calls.all()[0].args[0].payload.id; // retrieve transactionId passed into one of the actions

            httpMock.expectOne(getCreateSessionUrl()).flush(getTransactionStartedResponse(transactionId));
            httpMock.expectOne(getGetProblemsUrl(transactionId)).flush([]);

            store.dispatch(new RollbackTransaction(transactionId));

            httpMock.expectOne(getRollbackTransactionUrl(transactionId)).flush(getTransactionRolledbackResponse(transactionId));

            store.pipe(select(state => state.sessions.sessions.entities[sessionId])).subscribe(sess => {
                expect(sess).not.toBeDefined();
            }).unsubscribe();
        });
    })
});

const mockedAppConfig = { getApiUrl: () => 'https://google.co.uk' };

let getCreatedSessionResponse = (sessionId: string) => {
    return {'id': sessionId, 'person': null, 'start': '2018-07-11T10:04:57.623Z', 'duration': 'PT30M', 'caseType': 'SCLAIMS', 'room': null}
}

let getTransactionStartedResponse = (id: string) => {
    return {'id': id, 'status': 'STARTED', 'rulesProcessingStatus': 'COMPLETE'}
}

let getTransactionCommittedResponse = (id: string) => {
    return {'id': id, 'status': 'COMMITTED', 'rulesProcessingStatus': 'COMPLETE'}
}

let getTransactionRolledbackResponse = (id: string) => {
    return {'id': id, 'status': 'ROLLEDBACK', 'rulesProcessingStatus': 'COMPLETE'}
}

let getCreateSessionUrl = () => `${mockedAppConfig.getApiUrl()}/sessions`;
let getGetProblemsUrl = (transactionId) => `${mockedAppConfig.getApiUrl()}/problems/by-user-transaction-id?id=${transactionId}`;
let getCommitTransactionUrl = (transactionId) => `${mockedAppConfig.getApiUrl()}/user-transaction/${transactionId}/commit`;
let getRollbackTransactionUrl = (transactionId) => `${mockedAppConfig.getApiUrl()}/user-transaction/${transactionId}/rollback`;
let getSessionByIdUrl = (sessionId) => `${mockedAppConfig.getApiUrl()}/sessions/${sessionId}`;
let getGetHearingPartsUrl = () => `${mockedAppConfig.getApiUrl()}/hearing-part`;

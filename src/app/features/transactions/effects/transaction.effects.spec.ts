import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfig } from '../../../app.config';
import { TransactionEffects } from './transaction.effects';
import {
    TransactionBackendService,
} from '../services/transaction-backend.service';
import { ProblemsService } from '../../../problems/services/problems.service';
import * as fromTransactionActions from '../actions/transaction.action';

const mockedAppConfig = { getApiUrl: () => 'https://google.co.uk' };

describe('Transaction Effects', () => {
    let effects: TransactionEffects;
    let actions: Observable<any>;
    let transactionBackendService: TransactionBackendService;

    let transactionId = 'tr-id';
    let successfulCommitResponse = {
        id: transactionId,
        action: 'commit',
        success: true
    };
    let successfulRollbackResponse = {
        id: transactionId,
        action: 'rollback',
        success: true
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                TransactionEffects,
                { provide: AppConfig, useValue: mockedAppConfig},
                provideMockActions(() => actions),
                TransactionBackendService,
                ProblemsService
            ],
        });

        effects = TestBed.get(TransactionEffects);
        transactionBackendService = TestBed.get(TransactionBackendService);
    });

    describe('When Committing action', () => {
        it('it should call proper service and return \'TransactionCommitted\' action', () => {
            spyOn(transactionBackendService, 'commitTransaction').and.returnValue(Observable.of(successfulCommitResponse));

            const action = new fromTransactionActions.CommitTransaction(transactionId);
            const expectedAction = new fromTransactionActions.TransactionCommitted(transactionId);

            actions = hot('--a-', { a: action });
            const expected = cold('--b', { b: expectedAction });

            expect(effects.commitTransaction).toBeObservable(expected);
        });
    });

    describe('When Committing action which fails', () => {
        it('it should call proper service and return \'TransactionCommitFailed\' action', () => {
            let failedCommitResponse = { ... successfulCommitResponse, success: false };
            spyOn(transactionBackendService, 'commitTransaction').and.returnValue(Observable.of(failedCommitResponse));

            const action = new fromTransactionActions.CommitTransaction(transactionId);
            const expectedAction = new fromTransactionActions.TransactionCommitFailed(transactionId);

            actions = hot('--a-', { a: action });
            const expected = cold('--b', { b: expectedAction });

            expect(effects.commitTransaction).toBeObservable(expected);
        });
    });

    describe('When Rollback action', () => {
        it('it should call proper service and return \'TransactionRolledback\' action', () => {
            spyOn(transactionBackendService, 'rollbackTransaction').and.returnValue(Observable.of(successfulRollbackResponse));

            const action = new fromTransactionActions.RollbackTransaction(transactionId);
            const expectedAction = new fromTransactionActions.TransactionRolledBack(transactionId);

            actions = hot('--a-', { a: action });
            const expected = cold('--b', { b: expectedAction });

            expect(effects.rollbackTransaction).toBeObservable(expected);
        });
    });

    describe('When Rollback action action which fails', () => {
        it('it should call proper service and return \'TransactionRollbackFailed\' action', () => {
            let failedRollbackResponse = { ... successfulRollbackResponse, success: false };
            spyOn(transactionBackendService, 'rollbackTransaction').and.returnValue(Observable.of(failedRollbackResponse));

            const action = new fromTransactionActions.RollbackTransaction(transactionId);
            const expectedAction = new fromTransactionActions.TransactionRollbackFailed(transactionId);

            actions = hot('--a-', { a: action });
            const expected = cold('--b', { b: expectedAction });

            expect(effects.rollbackTransaction).toBeObservable(expected);
        });
    })
});

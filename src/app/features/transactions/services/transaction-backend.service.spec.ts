import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../../../app.config';
import { RulesProcessingStatuses, Transaction, TransactionBackendService, TransactionStatuses } from './transaction-backend.service';

const mockedAppConfig = { getApiUrl: () => 'https://google.co.uk' };

let transactionBackendService: TransactionBackendService;
let httpMock: HttpTestingController;

let transactionId = 'tr-id';

let transaction = {
    id: transactionId,
    rulesProcessingStatus: RulesProcessingStatuses.COMPLETE,
    status: TransactionStatuses.STARTED
} as Transaction;

describe('TransactionBackendService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                TransactionBackendService,
                { provide: AppConfig, useValue: mockedAppConfig }
            ]
        });
        transactionBackendService = TestBed.get(TransactionBackendService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('commitTransaction', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/user-transaction/${transactionId}/commit`;

        it('should call proper url', () => {
            transactionBackendService.commitTransaction(transactionId).subscribe();
            httpMock.expectOne(expectedUrl).flush(transaction);
        });
    });

    describe('rollbackTransaction', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/user-transaction/${transactionId}/rollback`;

        it('should call proper url', () => {
            transactionBackendService.rollbackTransaction(transactionId).subscribe();
            httpMock.expectOne(expectedUrl).flush(transaction);
        });
    });

    describe('getUserTransaction', () => {
        const expectedUrl = `${mockedAppConfig.getApiUrl()}/user-transaction/${transactionId}`;

        it('should call proper url', () => {
            transactionBackendService.getUserTransaction(transactionId).subscribe();
            httpMock.expectOne(expectedUrl).flush(transaction);
        });
    });
});

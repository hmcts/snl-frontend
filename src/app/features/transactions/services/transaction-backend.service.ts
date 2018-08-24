import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

export enum TransactionActions {
    ROLLBACK = 'rollback',
    COMMIT = 'commit'
}

export enum RulesProcessingStatuses {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETE = 'COMPLETE'
}

export enum TransactionStatuses {
    STARTED = 'STARTED',
    INPROGRESS = 'INPROGRESS', // PESSIMISTICLY_LOCKED,
    COMMITTED = 'COMMITTED',
    ROLLEDBACK = 'ROLLEDBACK',
    CONFLICT = 'CONFLICT',
}

export interface Transaction {
    id: string,
    rulesProcessingStatus: RulesProcessingStatuses,
    status: TransactionStatuses
}

@Injectable()
export class TransactionBackendService {
    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    getUserTransaction(id: string): Observable<Transaction> {
        return this.http
            .get<Transaction>(`${this.getUrl()}/${id}`)
    }

    rollbackTransaction(id: string): Observable<any> {
        return this.setTransactionAction(id, TransactionActions.ROLLBACK)
    }

    commitTransaction(id: string): Observable<any> {
        return this.setTransactionAction(id, TransactionActions.COMMIT)
    }

    private setTransactionAction(id: string, action: TransactionActions) {
        return this.http
            .post<any>(`${this.getUrl()}/${id}/${action}`, {})
            .pipe(map(data =>  data || []));
    }

    private getUrl() {
        return `${this.config.getApiUrl()}/user-transaction`;
    }
}

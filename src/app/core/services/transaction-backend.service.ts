import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class TransactionBackendService {
    constructor(private http: HttpClient, private config: AppConfig) {
    }

    getUserTransaction(id: string | String): Observable<Transaction> {
        return this.http
            .get<Transaction>(`${this.getUrl()}/${id}`)
    }

    rollbackTransaction(id: string | String): Observable<any> {
        return this.setTransactionAction(id, TransactionActions.ROLLBACK)
    }

    commitTransaction(id: string | String): Observable<any> {
        return this.setTransactionAction(id, TransactionActions.COMMIT)
    }

    private setTransactionAction(id: string | String, action: TransactionActions) {
        return this.http
            .post<any>(`${this.getUrl()}/${id}/${action}`, {})
            .pipe(map(data =>  data || []));
    }

    private getUrl() {
        return `${this.config.getApiUrl()}/user-transaction`;
    }
}

export enum TransactionActions {
    ROLLBACK = 'rollback',
    COMMIT = 'commit'
}

export interface Transaction {
    id: string,
    rulesProcessingStatus: string,
    status: string
}
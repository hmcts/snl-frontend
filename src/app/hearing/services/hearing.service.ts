import { EntityTransaction } from './../../features/transactions/models/transaction-status.model';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AdjournHearingRequest, Hearing, UnlistHearingRequest, WithdrawHearingRequest, VacateHearingRequest } from '../models/hearing';
import { Observable } from 'rxjs/Observable';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';
import { Transaction } from '../../features/transactions/services/transaction-backend.service';
import { Store } from '@ngrx/store';
import { InitializeTransaction, UpdateTransaction } from '../../features/transactions/actions/transaction.action';
import { State } from '../../hearing-part/reducers/hearing.reducer';
import { RemoveAll } from '../../problems/actions/problem.action';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { FilteredHearingViewmodel, HearingSearchResponseForAmendment } from '../../hearing-part/models/filtered-hearing-viewmodel';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { SearchHearingRequest } from '../../hearing-part/models/search-hearing-request';
import { Page } from '../../problems/models/problem.model';
import * as fromHearingParts from '../../hearing-part/actions/hearing-part.action'

@Injectable()
export class HearingService {
    hearings: Observable<Hearing[]>;
    private _hearings = <BehaviorSubject<Hearing[]>>new BehaviorSubject([]);
    private dataStore: { hearings: Hearing[] } = { hearings: [] };

    constructor(
    private readonly http: HttpClient,
    private readonly config: AppConfig,
    private readonly notesPopulatorService: NotesPopulatorService,
    private readonly store: Store<State>
    ) {
        this.hearings = this._hearings.asObservable();
    }

    getById(id: string) {
        this.http
          .get<Hearing>(`${this.config.getApiUrl()}/hearing/${id}/with-sessions`)
          .subscribe(data => {
            this.notesPopulatorService.populateWithNotes(data);
            const oldHearingIndex = this.dataStore.hearings.findIndex(h => h.id === data.id)

            if (oldHearingIndex < 0) {
              this.dataStore.hearings.push(data);
            } else {
              this.dataStore.hearings[oldHearingIndex] = data
            }

            this._hearings.next({...this.dataStore}.hearings);
          });
    }

    unlist(hearing: Hearing) {
        const unlistHearingRequest: UnlistHearingRequest = {
          hearingId: hearing.id,
          hearingPartsVersions: hearing.hearingPartsVersions,
          userTransactionId: uuid()
        }

        this.removeEntitiesFromStateAndInitializeTransaction(unlistHearingRequest.userTransactionId);

        return this.http
          .put<Transaction>(`${this.config.getApiUrl()}/hearing/unlist`, JSON.stringify(unlistHearingRequest), {
            headers: {'Content-Type': 'application/json'}
          }).subscribe(data => this.store.dispatch(new UpdateTransaction(data)));
    }

    adjourn(hearing: Hearing) {
        const adjournHearingRequest: AdjournHearingRequest = {
            hearingId: hearing.id,
            hearingVersion: hearing.version,
            userTransactionId: uuid()
        };

        this.removeEntitiesFromStateAndInitializeTransaction(adjournHearingRequest.userTransactionId);

        this.http
            .put<Transaction>(`${this.config.getApiUrl()}/hearing/adjourn`, JSON.stringify(adjournHearingRequest), {
                headers: {'Content-Type': 'application/json'}
            }).subscribe(data => this.store.dispatch(new UpdateTransaction(data)));
    }

    withdraw(hearing: Hearing) {
        const withdrawHearingRequest: WithdrawHearingRequest = {
            hearingId: hearing.id,
            hearingVersion: hearing.version,
            userTransactionId: uuid()
        };

        this.removeEntitiesFromStateAndInitializeTransaction(withdrawHearingRequest.userTransactionId);

        this.http
            .put<Transaction>(`${this.config.getApiUrl()}/hearing/withdraw`, JSON.stringify(withdrawHearingRequest), {
                headers: {'Content-Type': 'application/json'}
            }).subscribe(data => this.store.dispatch(new UpdateTransaction(data)));
    }

    vacate(hearing: Hearing) {
        const vacateHearingRequest: VacateHearingRequest = {
            hearingId: hearing.id,
            hearingVersion: hearing.version,
            userTransactionId: uuid()
        };

        this.removeEntitiesFromStateAndInitializeTransaction(vacateHearingRequest.userTransactionId);

        this.http
            .put<Transaction>(`${this.config.getApiUrl()}/hearing/vacate`, JSON.stringify(vacateHearingRequest), {
                headers: {'Content-Type': 'application/json'}
            }).subscribe(data => this.store.dispatch(new UpdateTransaction(data)));
    }

    getForAmendment(id: string): Observable<HearingSearchResponseForAmendment> {
        return this.http
            .get<HearingSearchResponseForAmendment>(`${this.config.getApiUrl()}/hearing/${id}/for-amendment`).pipe(map(
                (hearing: HearingSearchResponseForAmendment) => {
                    return this.parseDatesAndDurations(hearing);
                }
            ));
    }

    seearchFilteredHearingViewmodels(request: SearchHearingRequest): Observable<Page<FilteredHearingViewmodel>> {
        return this.http
            .post<Page<FilteredHearingViewmodel>>(`${this.config.getApiUrl()}/hearing`, request.searchCriteria, {
                params: new HttpParams({ fromObject: request.httpParams })
            }).pipe(map((hearingPage: Page<FilteredHearingViewmodel>) => {
                hearingPage.content = hearingPage.content.map(hearing => {
                    return this.parseDatesAndDurations(hearing);
                });
                return {...hearingPage, content: hearingPage.content}
            }))
    }

    private parseDatesAndDurations = (hearing) => {
        hearing.scheduleStart = hearing.scheduleStart !== null ? moment(hearing.scheduleStart) : null;
        hearing.scheduleEnd = hearing.scheduleEnd !== null ? moment(hearing.scheduleEnd) : null;
        hearing.listingDate = moment(hearing.listingDate);
        hearing.duration = moment.duration(hearing.duration);
        return hearing;
    }

    private removeEntitiesFromStateAndInitializeTransaction(transactionId: string) {
        this.store.dispatch(new RemoveAll());
        this.store.dispatch(new InitializeTransaction({ id: transactionId } as EntityTransaction));
        this.store.dispatch(new fromHearingParts.RemoveAll())
    }
}

import { EntityTransaction } from './../../features/transactions/models/transaction-status.model';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AdjournHearingRequest, Hearing, UnlistHearingRequest, WithdrawHearingRequest, } from '../models/hearing';
import { Observable } from 'rxjs/Observable';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';
import { Transaction } from '../../features/transactions/services/transaction-backend.service';
import { Store } from '@ngrx/store';
import { InitializeTransaction, UpdateTransaction } from '../../features/transactions/actions/transaction.action';
import { State } from '../../hearing-part/reducers/hearing.reducer';
import { RemoveAll } from '../../problems/actions/problem.action';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import {
    FilteredHearingViewmodel,
    HearingSearchResponseForAmendment,
    HearingViewmodelForAmendment, mapToUpdateHearingRequest
} from '../../hearing-part/models/filtered-hearing-viewmodel';
import * as moment from 'moment';
import { map, mergeMap, tap } from 'rxjs/operators';
import { SearchHearingRequest } from '../../hearing-part/models/search-hearing-request';
import { Page } from '../../problems/models/problem.model';
import * as fromHearingParts from '../../hearing-part/actions/hearing-part.action'
import {
    HearingForListing,
    HearingForListingResponse, HearingForListingWithNotes,
    mapResponseToHearingForListing
} from '../../hearing-part/models/hearing-for-listing-with-notes.model';
import { NotesService } from '../../notes/services/notes.service';
import { Note } from '../../notes/models/note.model';
import { HearingDeletion } from '../../hearing-part/models/hearing-deletion';
import { HearingToSessionAssignment } from '../../hearing-part/models/hearing-to-session-assignment';
import { UpdateHearingRequest } from '../../hearing-part/models/update-hearing-request';

@Injectable()
export class HearingService {
    hearings: Observable<Hearing[]>;
    private _hearings = <BehaviorSubject<Hearing[]>>new BehaviorSubject([]);
    private dataStore: { hearings: Hearing[] } = {hearings: []};

    constructor(
        private readonly http: HttpClient,
        private readonly config: AppConfig,
        private readonly notesPopulatorService: NotesPopulatorService,
        private readonly notesService: NotesService,
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

    deleteHearing(hearingDeletion: HearingDeletion) {
        this.store.dispatch(new RemoveAll());
        this.store.dispatch(new InitializeTransaction({id: hearingDeletion.userTransactionId} as EntityTransaction));

        return this.http
            .post<Transaction>(`${this.config.getApiUrl()}/hearing-part/delete`, hearingDeletion, {
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

    assignToSession(assignment: HearingToSessionAssignment) {
        this.store.dispatch(new RemoveAll());
        this.store.dispatch(new InitializeTransaction({id: assignment.userTransactionId} as EntityTransaction));

        return this.http
            .put<Transaction>(`${this.config.getApiUrl()}/hearing/${(assignment).hearingId}`, assignment)
            .pipe(tap((data => this.store.dispatch(new UpdateTransaction(data))))).subscribe();
    }

    getForAmendment(id: string): Observable<HearingSearchResponseForAmendment> {
        return this.http
            .get<HearingSearchResponseForAmendment>(`${this.config.getApiUrl()}/hearing/${id}/for-amendment`).pipe(map(
                (hearing: HearingSearchResponseForAmendment) => {
                    return this.parseDatesAndDurations(hearing);
                }
            ));
    }

    updateListing(hearingForAmendment: HearingViewmodelForAmendment) {
        let update: UpdateHearingRequest = mapToUpdateHearingRequest(hearingForAmendment,  uuid());

        this.store.dispatch(new RemoveAll());
        this.store.dispatch(new InitializeTransaction({ id: update.userTransactionId } as EntityTransaction));

        this.http
            .put<Transaction>(`${this.config.getApiUrl()}/hearing-part/update`, JSON.stringify(update), {
                headers: {'Content-Type': 'application/json'}
            }).pipe(tap((data => this.store.dispatch(new UpdateTransaction(data))))).subscribe();
    }

    getHearingsForListing(request: SearchHearingRequest): Observable<Page<HearingForListingWithNotes>> {
        return this.http
            .get<Page<HearingForListingResponse>>(`${this.config.getApiUrl()}/hearing/for-listing`, {
                params: new HttpParams({fromObject: request.httpParams})
            }).pipe(map<Page<HearingForListingResponse>, Page<HearingForListing>>((hearingPage: Page<HearingForListingResponse>) => {
                let content = hearingPage.content.map(hearingForListingResponse => {
                    return mapResponseToHearingForListing(hearingForListingResponse);
                });
                return {...hearingPage, content: content}
            }), mergeMap<Page<HearingForListing>, Page<HearingForListingWithNotes>>((hearingForListingPage: Page<HearingForListing>) => {
                let hearingIds = hearingForListingPage.content.map(h => h.id);
                return this.notesService.getByEntitiesAsDictionary(hearingIds).pipe(mergeMap((notes: {[id: string]: Note[]}) => {
                    const hearings: Page<HearingForListingWithNotes> = {...hearingForListingPage, content: []};
                    hearingForListingPage.content.forEach(h => {
                        let hearing: HearingForListingWithNotes = {...h, notes: notes[h.id] || []};
                        hearings.content.push(hearing)
                    });
                    return Observable.of(hearings);
                }))
            }))
    }

    seearchFilteredHearingViewmodels(request: SearchHearingRequest): Observable<Page<FilteredHearingViewmodel>> {
        return this.http
            .post<Page<FilteredHearingViewmodel>>(`${this.config.getApiUrl()}/hearing`, request.searchCriteria, {
                params: new HttpParams({fromObject: request.httpParams})
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

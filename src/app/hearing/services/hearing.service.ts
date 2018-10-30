import { EntityTransaction } from './../../features/transactions/models/transaction-status.model';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { Hearing, UnlistHearingRequest } from '../models/hearing';
import { Observable } from 'rxjs/Observable';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';
import { Transaction } from '../../features/transactions/services/transaction-backend.service';
import { Store } from '@ngrx/store';
import { InitializeTransaction, UpdateTransaction } from '../../features/transactions/actions/transaction.action';
import { State } from '../../hearing-part/reducers/hearing.reducer';
import { RemoveAll } from '../../problems/actions/problem.action';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HearingService {
  hearings: Observable<Hearing[]>
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

        this._hearings.next(Object.assign({}, this.dataStore).hearings);
      });
  }

  unlist(hearing: Hearing) {
    const unlistHearingRequest: UnlistHearingRequest = {
      hearingId: hearing.id,
      hearingPartsVersions: hearing.hearingPartsVersions,
      userTransactionId: uuid()
    }

    this.store.dispatch(new RemoveAll());
    this.store.dispatch(new InitializeTransaction({ id: unlistHearingRequest.userTransactionId } as EntityTransaction))

    return this.http
      .put<Transaction>(`${this.config.getApiUrl()}/hearing/`, JSON.stringify(unlistHearingRequest), {
        headers: {'Content-Type': 'application/json'}
      }).subscribe(data => this.store.dispatch(new UpdateTransaction(data)));
  }
}

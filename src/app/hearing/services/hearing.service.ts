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

@Injectable()
export class HearingService {
  constructor(
    private readonly http: HttpClient,
    private readonly config: AppConfig,
    private readonly notesPopulatorService: NotesPopulatorService,
    private readonly store: Store<State>
  ) { }

  getById(id: string): Observable<Hearing> {
    return this.http
      .get<Hearing>(`${this.config.getApiUrl()}/hearing/${id}/with-sessions`)
      .map(data => {
        this.notesPopulatorService.populateWithNotes(data);
        return data;
      });
  }

  unlist(hearing: Hearing): Observable<Transaction> {
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
    }).map(data => {
      this.store.dispatch(new UpdateTransaction(data))
      return data
    });
  }
}

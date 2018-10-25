import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { Hearing } from '../models/hearing';
import { Observable } from 'rxjs/Observable';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HearingService {
  hearings: Observable<Hearing[]>;
  private _hearings = <BehaviorSubject<Hearing[]>>new BehaviorSubject([]);
  private dataStore: { hearings: Hearing[] } = { hearings: [] };

  constructor(
    private readonly http: HttpClient,
    private readonly config: AppConfig,
    private readonly notesPopulatorService: NotesPopulatorService
  ) {
    this.hearings = this._hearings.asObservable()
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

        // return copy of hearings
        this._hearings.next(Object.assign({}, this.dataStore).hearings);
      });
  }

  /*
  create(hearing: Hearing) {
    this.http.post<Hearing>(`${this.config.getApiUrl()}/hearings`, JSON.stringify(hearing)).subscribe(data => {
        this.dataStore.hearings.push(data);
        this._hearings.next(Object.assign({}, this.dataStore).hearings);
      });
  }

  update(hearing: Hearing) {
    this.http.put<Hearing>(`${this.config.getApiUrl()}/hearings/${hearing.id}`, JSON.stringify(hearing))
      .subscribe(data => {
        this.dataStore.hearings.forEach((t, i) => {
          if (t.id === data.id) { this.dataStore.hearings[i] = data; }
        });

        this._hearings.next(Object.assign({}, this.dataStore).hearings);
      }, error => console.log('Could not update todo.'));
  }
  */
}

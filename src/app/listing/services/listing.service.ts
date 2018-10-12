import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { Hearing } from '../models/listing';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { NotesPopulatorService } from '../../notes/services/notes-populator.service';

@Injectable()
export class ListingService {
  constructor(
    private readonly http: HttpClient,
    private readonly config: AppConfig,
    private readonly notesPopulatorService: NotesPopulatorService
  ) {

  }

  getById(id: string): Observable<any> {
    return this.http
      .get<Hearing>(`${this.config.getApiUrl()}/hearing/${id}/with-sessions`)
      .pipe(map(data => {
        this.notesPopulatorService.populateWithNotes(data);
        return data;
      }));
  }
}

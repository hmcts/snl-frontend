import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Note } from '../models/note.model';

@Injectable()
export class NotesService {

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    get(): Observable<Note[]> {
        return this.http
            .get<Note[]>(`${this.config.getNotesUrl()}/notes`)
            .pipe(map(notes => notes || []));
    }

    create(note: Note): Observable<Note> {
        return this.http
            .post<Note>(`${this.config.getNotesUrl()}/notes`, note)
    }

    createMany(notes: Note[]): Observable<Note[]> {
        return this.http
            .post<Note[]>(`${this.config.getNotesUrl()}/notes`, notes)
    }

}

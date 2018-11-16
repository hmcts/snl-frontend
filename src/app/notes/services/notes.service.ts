import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { Note } from '../models/note.model';
import { getNoteUpsertFromNoteViewModel, NoteUpsert } from '../models/note-upsert.model';
import * as moment from 'moment';

@Injectable()
export class NotesService {

    constructor(private readonly http: HttpClient, private readonly config: AppConfig) {
    }

    get(): Observable<Note[]> {
        return this.http
            .get<Note[]>(this.getUrl())
            .pipe(map(notes => notes || []));
    }

    getByEntities(ids: string[]): Observable<Note[]> {
        return this.http
            .post<Note[]>(`${this.getUrl()}/entities`, ids)
            .pipe(map(notes => { return notes.map(n => {return {...n, createdAt: moment(n.createdAt)}})}));
    }

    upsertMany(notes: NoteUpsert[]): Observable<Note[]> {
        return this.http
            .put<Note[]>(this.getUrl(), notes)
    }

    upsertManyNotes(notes: Note[]): Observable<Note[]> {
        const noteUpsert = notes.map(getNoteUpsertFromNoteViewModel);

        return this.upsertMany(noteUpsert);
    }

    private getUrl() {
        return `${this.config.getNotesUrl()}/notes`;
    }
}

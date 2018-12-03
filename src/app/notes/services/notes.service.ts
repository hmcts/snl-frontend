import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap } from 'rxjs/operators';
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

    getByEntitiesAsDictionary(ids: string[]): Observable<{[id: string]: Note[]}> {
        return this.http
            .post<{[id: string]: Note[]}>(`${this.getUrl()}/entities-dictionary`, ids)
            .pipe(map((notes: {[id: string]: Note[]}) => {
                Object.keys(notes).forEach(key => {
                    notes[key].forEach(n => { n.createdAt = moment(n.createdAt) });
                });
                return notes;
            }));
    }

    populateWithNotes(entities: any[]): Observable<any[]> {
        let entityIds: string[] = entities.map(e => e.id);

        let entitiesWithNotes = [];
        return this.getByEntitiesAsDictionary(entityIds).pipe(mergeMap((notes) => {
            entities.forEach(h => {
                let entityWithNotes: any = {...h, notes: notes[h.id] || []};
                entitiesWithNotes.push(entityWithNotes)
            });
            return Observable.of(entitiesWithNotes);
        }))
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

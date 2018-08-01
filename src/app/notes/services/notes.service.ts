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
            .get<Note[]>(this.getUrl())
            .pipe(map(notes => notes || []));
    }

    createMany(notes: Note[]): Observable<Note[]> {
        return this.http
            .post<Note[]>(this.getUrl(), notes)
    }

    private getUrl() {
        return `${this.config.getNotesUrl()}/notes`;
    }
}

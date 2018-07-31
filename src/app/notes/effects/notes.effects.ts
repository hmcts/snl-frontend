import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Get, UpsertMany, UpsertOne, GetFailed, NoteActionTypes, Create, CreateMany } from '../actions/notes.action';
import { NotesService } from '../services/notes.service';

@Injectable()
export class NotesEffects {
    @Effect()
    get$: Observable<Action> = this.actions$.pipe(
        ofType<Get>(NoteActionTypes.Get),
        mergeMap(action =>
            this.notesService.get().pipe(
                map(data => (new UpsertMany(data))),
                catchError((err: HttpErrorResponse) => of(new GetFailed(err.error)))
            )
        )
    );

    @Effect()
    create$: Observable<Action> = this.actions$.pipe(
        ofType<Create>(NoteActionTypes.Create),
        mergeMap(action =>
            this.notesService.create(action.payload).pipe(
                map(createdNote => (new UpsertOne(createdNote))),
                catchError((err: HttpErrorResponse) => of(new GetFailed(err.error)))
            )
        )
    );

    @Effect()
    createMany$: Observable<Action> = this.actions$.pipe(
        ofType<CreateMany>(NoteActionTypes.CreateMany),
        mergeMap(action =>
            this.notesService.createMany(action.payload).pipe(
                map(createdNotes => (new UpsertMany(createdNotes))),
                catchError((err: HttpErrorResponse) => of(new GetFailed(err.error)))
            )
        )
    );

    constructor(private readonly notesService: NotesService, private readonly actions$: Actions) {}
}

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Get, UpsertMany, UpsertOne, NoteActionTypes, Create, CreateMany, Error } from '../actions/notes.action';
import { NotesService } from '../services/notes.service';

@Injectable()
export class NotesEffects {
    @Effect()
    get$: Observable<Action> = this.actions$.pipe(
        ofType<Get>(NoteActionTypes.Get),
        mergeMap(action =>
            this.notesService.get().pipe(
                map(data => (new UpsertMany(data))),
                catchError((err: HttpErrorResponse) => of(new Error(err.error)))
            )
        )
    );

    @Effect()
    create$: Observable<Action> = this.actions$.pipe(
        ofType<Create>(NoteActionTypes.Create),
        mergeMap(action =>
            this.notesService.create(action.payload).pipe(
                map(createdNote => (new UpsertOne(createdNote))),
                catchError((err: HttpErrorResponse) => of(new Error(err.error)))
            )
        )
    );

    @Effect()
    createMany$: Observable<Action> = this.actions$.pipe(
        ofType<CreateMany>(NoteActionTypes.CreateMany),
        filter(action => action.payload.length > 0),
        mergeMap(action =>
            this.notesService.createMany(action.payload).pipe(
                map(createdNotes => (new UpsertMany(createdNotes))),
                catchError((err: HttpErrorResponse) => of(new Error(err.error)))
            )
        )
    );

    @Effect()
    error$: Observable<Action> = this.actions$.pipe(
        ofType<Error>(NoteActionTypes.Error),
        distinctUntilChanged(),
        tap(console.log)
    );

    constructor(private readonly notesService: NotesService, private readonly actions$: Actions) {}
}

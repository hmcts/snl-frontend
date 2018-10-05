import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { NotesEffects } from './notes.effects';
import * as NoteActions from '../actions/notes.action';
import { NotesService } from '../services/notes.service';
import { Note } from '../models/note.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { HttpErrorResponse } from '@angular/common/http';
import { NoteActionTypes } from '../actions/notes.action';

const mockedAppConfig = { getApiUrl: () => 'https://google.co.uk' };

describe('Notes Effects', () => {
    let effects: NotesEffects;
    let actions: Observable<any>;
    let notesService: NotesService;

    let note = {
        id: undefined,
        content: 'a',
        type: 't',
        entityId: undefined,
        entityType: 'e'
    } as Note;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                NotesEffects,
                { provide: AppConfig, useValue: mockedAppConfig},
                provideMockActions(() => actions),
                NotesService
            ],
        });

        effects = TestBed.get(NotesEffects);
        notesService = TestBed.get(NotesService);
    });

    describe('When creating many notes', () => {
        it('with non-empty notes payload it should call proper service and return \'UpsertMany\' action', () => {
            spyOn(notesService, 'upsertMany').and.returnValue(Observable.of([note]));

            const action = new NoteActions.CreateMany([note]);
            const expectedAction = new NoteActions.UpsertMany([note]);

            actions = hot('--a-', { a: action });
            const expected = cold('--b', { b: expectedAction });

            expect(effects.createMany$).toBeObservable(expected);
        });

        it('with empty notes payload it should call proper service and do not return any action', () => {
            spyOn(notesService, 'upsertMany').and.returnValue(Observable.of([note]));

            const action = new NoteActions.CreateMany([]);

            actions = hot('--a-', { a: action });
            const expected = cold('---', );

            expect(effects.createMany$).toBeObservable(expected);
        });
    });

    describe('When getting notes', () => {
        it('it should call proper service and return \'UpsertMany\' action', () => {
            spyOn(notesService, 'get').and.returnValue(Observable.of([note]));

            const action = new NoteActions.Get();
            const expectedAction = new NoteActions.UpsertMany([note]);

            actions = hot('--a-', { a: action });
            const expected = cold('--b', { b: expectedAction });

            expect(effects.get$).toBeObservable(expected);
        });
    })

    describe('When Http service throws error', () => {
        it('it should return the generic \'Error\' action', () => {
            let errorMsg = new HttpErrorResponse({statusText: 'Error'});
            spyOn(notesService, 'get').and.callFake(() => { return Observable.throw(errorMsg) });

            const action = new NoteActions.Get();

            actions = hot('--a-', { a: action });

            effects.get$.subscribe(data => {
                expect(data.type).toEqual(NoteActionTypes.Error);
            })
        });
    })
});

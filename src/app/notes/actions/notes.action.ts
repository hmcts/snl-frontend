import { Action } from '@ngrx/store';
import { Note } from '../models/note.model';

export enum NoteActionTypes {
  Get = '[Notes] Get',
  CreateMany = '[Notes] Create Many',

  UpsertMany = '[Notes] Upsert Many',
  UpsertOne = '[Notes] Upsert One',

  Error = '[Notes] Error'
}

export class Get implements Action {
  readonly type = NoteActionTypes.Get;

  constructor() {}
}

export class CreateMany implements Action {
  readonly type = NoteActionTypes.CreateMany;

  constructor(public payload: Note[]) {}
}

export class UpsertMany implements Action {
    readonly type = NoteActionTypes.UpsertMany;

    constructor(public payload: Note[]) {}
}

export class UpsertOne implements Action {
    readonly type = NoteActionTypes.UpsertOne;

    constructor(public payload: Note) {}
}

export class Error implements Action {
    readonly type = NoteActionTypes.Error;

    constructor(public payload: string) {}
}

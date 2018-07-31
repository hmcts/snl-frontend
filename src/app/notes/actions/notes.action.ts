import { Action } from '@ngrx/store';
import { Note } from '../models/note.model';

export enum NoteActionTypes {
  Get = '[Notes] Get',
  GetComplete = '[Notes] Get Complete',
  Error = '[Notes] Error',
  UpsertMany = '[Notes] Upsert Many',
  UpsertOne = '[Notes] Upsert One',
  Create = '[Notes] Create',
  CreateMany = '[Notes] Create Many'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class Get implements Action {
  readonly type = NoteActionTypes.Get;

  constructor() {}
}

export class Create implements Action {
  readonly type = NoteActionTypes.Create;

  constructor(public payload: Note) {}
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

export class GetComplete implements Action {
    readonly type = NoteActionTypes.GetComplete;

    constructor() {}
}

export class Error implements Action {
    readonly type = NoteActionTypes.Error;

    constructor(public payload: string) {}
}

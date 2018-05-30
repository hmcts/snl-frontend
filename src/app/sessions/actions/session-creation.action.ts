import { Action } from '@ngrx/store';
import { Session } from '../models/session.model';
import { SessionQuery, SessionQueryForDates } from '../models/session-query.model';
import { SessionCreate } from '../models/session-create.model';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';
import { SessionCreationStatus } from '../models/session-creation-status.model';

export enum SessionCreationActionTypes {
  CreateComplete = '[SessionCreation] Create Complete',
  Create = '[SessionCreation] Create',
  CreateAcknowledged = '[SessionCreation] Create Acknowledged',
  ProblemsLoaded = '[SessionCreation] Problems Loaded',
  GetProblemsForSession = '[SessionCreation] Get problems for session',
  CreateFailed = '[SessionCreation] Create Failed',
  UpsertOne = '[SessionCreation] Upsert One',
  GetRecent = '[SessionCreation] Get Recent',
  RemoveOne = '[SessionCreation] Remove One'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class Create implements Action {
    readonly type = SessionCreationActionTypes.Create;

    constructor(public payload: string | String) {}
}

export class GetProblemsForSession implements Action {
    readonly type = SessionCreationActionTypes.GetProblemsForSession;

    constructor(public payload: string | String) {}
}

export class CreateAcknowledged implements Action {
    readonly type = SessionCreationActionTypes.CreateAcknowledged;

    constructor(public payload: string | String) {}
}

export class ProblemsLoaded implements Action {
    readonly type = SessionCreationActionTypes.ProblemsLoaded;

    constructor(public payload: string | String) {}
}

export class CreateComplete implements Action {
    readonly type = SessionCreationActionTypes.CreateComplete;

    constructor(public payload: string | String) {}
}

export class CreateFailed implements Action {
    readonly type = SessionCreationActionTypes.CreateFailed;

    constructor(public payload: string) {}
}

export class UpsertOne implements Action {
    readonly type = SessionCreationActionTypes.UpsertOne;

    constructor(public payload: SessionCreationStatus) {}
}

export class GetRecent implements Action {
    readonly type = SessionCreationActionTypes.GetRecent;

    constructor() {}
}

export class RemoveOne implements Action {
    readonly type = SessionCreationActionTypes.RemoveOne;

    constructor(public payload: string | String) {}
}

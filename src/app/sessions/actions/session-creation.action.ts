import { Action } from '@ngrx/store';
import { Session } from '../models/session.model';
import { SessionQuery, SessionQueryForDates } from '../models/session-query.model';
import { SessionCreate } from '../models/session-create.model';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';
import { SessionTransaction } from '../models/session-creation-status.model';
import { SessionActionTypes } from './session.action';

export enum SessionTransactionActionTypes {
  CreateComplete = '[SessionCreation] Create Complete',
  Create = '[SessionCreation] Create',
  CreateAcknowledged = '[SessionCreation] Create Acknowledged',
  ProblemsLoaded = '[SessionCreation] Problems Loaded',
  GetProblemsForSession = '[SessionCreation] Get problems for session',
  CreateFailed = '[SessionCreation] Create Failed',
  UpsertOne = '[SessionCreation] Upsert One',
  GetRecent = '[SessionCreation] Get Recent',
  RemoveOne = '[SessionCreation] Remove One',
  RollbackTransaction = '[SessionCreation] Rollback Transaction',
  CommitTransaction = '[SessionCreation] Commit Transaction'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class Create implements Action {
    readonly type = SessionTransactionActionTypes.Create;

    constructor(public payload: SessionTransaction) {}
}

export class GetProblemsForSession implements Action {
    readonly type = SessionTransactionActionTypes.GetProblemsForSession;

    constructor(public payload: string | String) {
    }
}

export class CreateAcknowledged implements Action {
    readonly type = SessionTransactionActionTypes.CreateAcknowledged;

    constructor(public payload: string | String) {}
}

export class ProblemsLoaded implements Action {
    readonly type = SessionTransactionActionTypes.ProblemsLoaded;

    constructor(public payload: string | String) {}
}

export class CreateComplete implements Action {
    readonly type = SessionTransactionActionTypes.CreateComplete;

    constructor(public payload: string | String) {}
}

export class CreateFailed implements Action {
    readonly type = SessionTransactionActionTypes.CreateFailed;

    constructor(public payload: string) {}
}

export class UpsertOne implements Action {
    readonly type = SessionTransactionActionTypes.UpsertOne;

    constructor(public payload: SessionTransaction) {}
}

export class GetRecent implements Action {
    readonly type = SessionTransactionActionTypes.GetRecent;

    constructor() {}
}

export class RemoveOne implements Action {
    readonly type = SessionTransactionActionTypes.RemoveOne;

    constructor(public payload: string | String) {}
}

export class RollbackTransaction implements Action {
    readonly type = SessionTransactionActionTypes.RollbackTransaction;

    constructor(public payload: string) {}
}

export class CommitTransaction implements Action {
    readonly type = SessionTransactionActionTypes.CommitTransaction;

    constructor(public payload: string) {}
}

import { Action } from '@ngrx/store';
import { SessionTransaction } from '../models/session-creation-status.model';

export enum SessionTransactionActionTypes {
  CreateComplete = '[SessionTransaction] Create Complete',
  Create = '[SessionTransaction] Create',
  CreateAcknowledged = '[SessionTransaction] Create Acknowledged',
  ProblemsLoaded = '[SessionTransaction] Problems Loaded',
  GetProblemsForSession = '[SessionTransaction] Get problems for session',
  CreateFailed = '[SessionTransaction] Create Failed',
  UpsertOne = '[SessionTransaction] Upsert One',
  GetRecent = '[SessionTransaction] Get Recent',
  RemoveOne = '[SessionTransaction] Remove One',
  RollbackTransaction = '[SessionTransaction] Rollback Transaction',
  TransactionRolledBack = '[SessionTransaction] Transaction Rolledback',
  CommitTransaction = '[SessionTransaction] Commit Transaction',
  TransactionCommitted = '[SessionTransaction] Transaction comitted'
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

export class TransactionRolledBack implements Action {
    readonly type = SessionTransactionActionTypes.TransactionRolledBack;

    constructor(public payload: string) {}
}

export class TransactionCommitted implements Action {
    readonly type = SessionTransactionActionTypes.TransactionCommitted;

    constructor(public payload: string) {}
}

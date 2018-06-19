import { Action } from '@ngrx/store';
import { SessionTransaction } from '../models/session-transaction-status.model';
import { Transaction } from '../../core/services/transaction-backend.service';

export enum SessionTransactionActionTypes {
  InitializeTransaction = '[SessionTransaction] Initialize Transaction',
  RollbackTransaction = '[SessionTransaction] Rollback Transaction',
  CommitTransaction = '[SessionTransaction] Commit Transaction',
  UpdateTransaction = '[SessionTransaction] Update Transaction',

  RemoveOne = '[SessionTransaction] Remove One',
  UpsertOne = '[SessionTransaction] Upsert One',

  TransactionComplete = '[SessionTransaction] Create Complete',
  TransactionStarted = '[SessionTransaction] Transaction Started',
  TransactionNotStarted = '[SessionTransaction] Transaction Not Started',
  TransactionAcknowledged = '[SessionTransaction] Create Acknowledged',
  TransactionRolledBack = '[SessionTransaction] Transaction Rolledback',
  TransactionCommitted = '[SessionTransaction] Transaction comitted',
  TransactionConflicted = '[SessionTransaction] Transaction Conflicted',
  TransactionFailed = '[SessionTransaction] Transaction Failed',

  GetTransactionUntilStartedOrConflict = '[SessionTransaction] Get Transaction until',
  GetProblemsForTransaction = '[SessionTransaction] Get problems for session',
  StatusAcquired = '[SessionTransaction] Transaction status acquired',
  ProblemsLoaded = '[SessionTransaction] Problems Loaded',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class InitializeTransaction implements Action {
    readonly type = SessionTransactionActionTypes.InitializeTransaction;

    constructor(public payload: SessionTransaction) {}
}

export class TransactionConflicted implements Action {
    readonly type = SessionTransactionActionTypes.TransactionConflicted;

    constructor(public payload: SessionTransaction) {}
}

export class GetTransactionUntilStartedOrConflict implements Action {
    readonly type = SessionTransactionActionTypes.GetTransactionUntilStartedOrConflict;

    constructor(public payload: Transaction) {}
}

export class GetProblemsForTransaction implements Action {
    readonly type = SessionTransactionActionTypes.GetProblemsForTransaction;

    constructor(public payload: string | String) {
    }
}

export class TransactionAcknowledged implements Action {
    readonly type = SessionTransactionActionTypes.TransactionAcknowledged;

    constructor(public payload: string | String) {}
}

export class ProblemsLoaded implements Action {
    readonly type = SessionTransactionActionTypes.ProblemsLoaded;

    constructor(public payload: string | String) {}
}

export class TransactionComplete implements Action {
    readonly type = SessionTransactionActionTypes.TransactionComplete;

    constructor(public payload: string | String) {}
}

export class TransactionFailed implements Action {
    readonly type = SessionTransactionActionTypes.TransactionFailed;

    constructor(public payload: string) {}
}

export class UpsertOne implements Action {
    readonly type = SessionTransactionActionTypes.UpsertOne;

    constructor(public payload: SessionTransaction) {}
}

export class RemoveOne implements Action {
    readonly type = SessionTransactionActionTypes.RemoveOne;

    constructor(public payload: string | String) {}
}

export class RollbackTransaction implements Action {
    readonly type = SessionTransactionActionTypes.RollbackTransaction;

    constructor(public payload: string) {}
}

export class UpdateTransaction implements Action {
    readonly type = SessionTransactionActionTypes.UpdateTransaction;

    constructor(public payload: Transaction) {}
}

export class StatusAqcuired implements Action {
    readonly type = SessionTransactionActionTypes.StatusAcquired;

    constructor(public payload: Transaction) {}
}

export class TransactionStarted implements Action {
    readonly type = SessionTransactionActionTypes.TransactionStarted;

    constructor(public payload: Transaction) {}
}

export class TransactionNotStarted implements Action {
    readonly type = SessionTransactionActionTypes.TransactionNotStarted;

    constructor(public payload: Transaction) {}
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

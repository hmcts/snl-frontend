import { Action } from '@ngrx/store';
import { SessionTransaction } from '../models/session-transaction-status.model';
import { Transaction } from '../../core/services/transaction-backend.service';

export enum SessionTransactionActionTypes {
  InitializeTransaction = '[SessionTransaction] Initialize Transaction',
  RollbackTransaction = '[SessionTransaction] Rollback Transaction',
  CommitTransaction = '[SessionTransaction] Commit Transaction',
  UpdateTransaction = '[SessionTransaction] Update Transaction',

  TransactionComplete = '[SessionTransaction] Create Complete',
  TransactionRolledBack = '[SessionTransaction] Transaction Rolledback',
  TransactionCommitted = '[SessionTransaction] Transaction comitted',
  TransactionConflicted = '[SessionTransaction] Transaction Conflicted',

  GetTransactionUntilStartedOrConflict = '[SessionTransaction] Get Transaction until',
  GetProblemsForTransaction = '[SessionTransaction] Get problems for session',
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

export class ProblemsLoaded implements Action {
    readonly type = SessionTransactionActionTypes.ProblemsLoaded;

    constructor(public payload: string | String) {}
}

export class TransactionComplete implements Action {
    readonly type = SessionTransactionActionTypes.TransactionComplete;

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

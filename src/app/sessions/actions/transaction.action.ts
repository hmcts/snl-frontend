import { Action } from '@ngrx/store';
import { EntityTransaction } from '../models/transaction-status.model';
import { Transaction } from '../../core/services/transaction-backend.service';

export enum EntityTransactionActionTypes {
  InitializeTransaction = '[EntityTransaction] Initialize Transaction',
  RollbackTransaction = '[EntityTransaction] Rollback Transaction',
  CommitTransaction = '[EntityTransaction] Commit Transaction',
  UpdateTransaction = '[EntityTransaction] Update Transaction',

  TransactionComplete = '[EntityTransaction] Create Complete',
  TransactionRolledBack = '[EntityTransaction] Transaction Rolledback',
  TransactionCommitted = '[EntityTransaction] Transaction comitted',
  TransactionConflicted = '[EntityTransaction] Transaction Conflicted',

  GetTransactionUntilStartedOrConflict = '[EntityTransaction] Get Transaction until',
  GetProblemsForTransaction = '[EntityTransaction] Get problems for session',
  ProblemsLoaded = '[EntityTransaction] Problems Loaded',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class InitializeTransaction implements Action {
    readonly type = EntityTransactionActionTypes.InitializeTransaction;

    constructor(public payload: EntityTransaction) {}
}

export class TransactionConflicted implements Action {
    readonly type = EntityTransactionActionTypes.TransactionConflicted;

    constructor(public payload: EntityTransaction) {}
}

export class GetTransactionUntilStartedOrConflict implements Action {
    readonly type = EntityTransactionActionTypes.GetTransactionUntilStartedOrConflict;

    constructor(public payload: Transaction) {}
}

export class GetProblemsForTransaction implements Action {
    readonly type = EntityTransactionActionTypes.GetProblemsForTransaction;

    constructor(public payload: string) {
    }
}

export class ProblemsLoaded implements Action {
    readonly type = EntityTransactionActionTypes.ProblemsLoaded;

    constructor(public payload: string) {}
}

export class TransactionComplete implements Action {
    readonly type = EntityTransactionActionTypes.TransactionComplete;

    constructor(public payload: string) {}
}

export class RollbackTransaction implements Action {
    readonly type = EntityTransactionActionTypes.RollbackTransaction;

    constructor(public payload: string) {}
}

export class UpdateTransaction implements Action {
    readonly type = EntityTransactionActionTypes.UpdateTransaction;

    constructor(public payload: Transaction) {}
}

export class CommitTransaction implements Action {
    readonly type = EntityTransactionActionTypes.CommitTransaction;

    constructor(public payload: string) {}
}

export class TransactionRolledBack implements Action {
    readonly type = EntityTransactionActionTypes.TransactionRolledBack;

    constructor(public payload: string) {}
}

export class TransactionCommitted implements Action {
    readonly type = EntityTransactionActionTypes.TransactionCommitted;

    constructor(public payload: string) {}
}

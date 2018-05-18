import { Action } from '@ngrx/store';
import { Judge } from '../models/judge.model';

export enum JudgeActionTypes {
  Get = '[Judge] Get',
  GetComplete = '[Judge] Get Complete',
  GetFailed = '[Judge] Get Failed'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class Get implements Action {
  readonly type = JudgeActionTypes.Get;

  constructor() {}
}

export class GetComplete implements Action {
    readonly type = JudgeActionTypes.GetComplete;

    constructor(public payload: Judge[]) {}
}

export class GetFailed implements Action {
    readonly type = JudgeActionTypes.GetFailed;

    constructor(public payload: String) {}
}

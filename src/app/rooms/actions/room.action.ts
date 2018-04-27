import { Action } from '@ngrx/store';
import { Judge } from '../../judges/models/judge.model';

export enum RoomActionTypes {
  Get = '[Room] Get',
  GetComplete = '[Room] Get Complete',
  GetFailed = '[Room] Get Failed'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class Get implements Action {
  readonly type = RoomActionTypes.Get;

  constructor() {
      console.log(this.type);
  }
}

export class GetComplete implements Action {
    readonly type = RoomActionTypes.GetComplete;

    constructor(public payload: Judge[]) {
        console.log(this.type);
    }
}

export class GetFailed implements Action {
    readonly type = RoomActionTypes.GetFailed;

    constructor(public payload: String) {
        console.log(this.type);
    }
}
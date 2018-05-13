import { Action } from '@ngrx/store';
import { CoreNotification } from '../model/core-notification';

export enum NotificationActionTypes {
  Create = '[CoreNotification] Notify',
  Dismiss = '[CoreNotification] Dismiss',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class Notify implements Action {
  readonly type = NotificationActionTypes.Create;

  constructor(public payload: CoreNotification) {
      console.log(this.type);
  }
}

export class Dismiss implements Action {
    readonly type = NotificationActionTypes.Dismiss;

    constructor() {
        console.log(this.type);
    }
}

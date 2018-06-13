import { Action } from '@ngrx/store';
import { CoreNotification } from '../model/core-notification';

export enum NotificationActionTypes {
  Create = '[CoreNotification] Notify',
  Dismiss = '[CoreNotification] Dismiss',
  OpenDialog = '[CoreNotification] Open Dialog',
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

  constructor(public payload: CoreNotification) {}
}

export class OpenDialog implements Action {
  readonly type = NotificationActionTypes.OpenDialog;

  constructor(public payload: string) {}
}

export class Dismiss implements Action {
    readonly type = NotificationActionTypes.Dismiss;

    constructor(public payload: string = null) {}
}

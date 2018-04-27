import { Action } from '@ngrx/store';
import { Session } from '../models/session.model';
import { SessionQuery } from '../models/session-query.model';

export enum SessionActionTypes {
  Search = '[Session] Search',
  SearchComplete = '[Session] Search Complete',
  SearchFailed = '[Session] Search Failed',
  Create = '[Session] Create',
  CreateComplete = '[Session] Create Complete',
  CreateFailed = '[Session] Create Failed',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class Search implements Action {
  readonly type = SessionActionTypes.Search;

  constructor(public payload: SessionQuery) {
      console.log(this.type);
  }
}

export class SearchComplete implements Action {
  readonly type = SessionActionTypes.SearchComplete;

  constructor(public payload: Session[]) {
    console.log('Action: searchComplete');
  }
}

export class SearchFailed implements Action {
  readonly type = SessionActionTypes.SearchFailed;

  constructor(public payload: string) {
      console.log(this.type);
  }
}

export class Create implements Action {
    readonly type = SessionActionTypes.Create;

    constructor(public payload: Session) {
        console.log(this.type);
    }
}

export class CreateComplete implements Action {
    readonly type = SessionActionTypes.CreateComplete;

    constructor(public payload: Session) {
        console.log(this.type);
    }
}

export class CreateFailed implements Action {
    readonly type = SessionActionTypes.CreateFailed;

    constructor(public payload: string) {
        console.log(this.type);
    }
}

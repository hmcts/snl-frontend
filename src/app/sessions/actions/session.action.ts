import { Action } from '@ngrx/store';
import { Session } from '../models/session.model';
import { SessionQuery, SessionQueryForDates } from '../models/session-query.model';

export enum SessionActionTypes {
  SearchForDates = '[Session] Search for given dates',
  Search = '[Book] Search',
  SearchComplete = '[Book] Search Complete',
  SearchFailed = '[Book] Search Failed',
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
    console.log('Action: search');
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
    console.log('Action: searchFailed | ' + payload);

  }
}

export class SearchForDates implements Action {
    readonly type = SessionActionTypes.SearchForDates;

    constructor(public payload: SessionQueryForDates) {}
}

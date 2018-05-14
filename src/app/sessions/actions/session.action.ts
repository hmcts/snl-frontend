import { Action } from '@ngrx/store';
import { Session } from '../models/session.model';
import { SessionQuery, SessionQueryForDates } from '../models/session-query.model';
import { SessionCreate } from '../models/session-create.model';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';

export enum SessionActionTypes {
  Search = '[Session] Search',
  SearchForDates = '[Session] Search for given dates',
  SearchForJudge = '[Session] Search for judge',
  SearchComplete = '[Session] Search Complete',
  SearchFailed = '[Session] Search Failed',
  Create = '[Session] Create',
  CreateComplete = '[Session] Create Complete',
  CreateFailed = '[Session] Create Failed',
  UpsertMany = '[Session] Upsert Many'
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
    console.log(this.type);
  }
}

export class SearchFailed implements Action {
  readonly type = SessionActionTypes.SearchFailed;

  constructor(public payload: any) {
      console.log(this.payload);
  }
}

export class SearchForDates implements Action {
    readonly type = SessionActionTypes.SearchForDates;

    constructor(public payload: SessionQueryForDates) {}
}

export class SearchForJudge implements Action {
    readonly type = SessionActionTypes.SearchForJudge;

    constructor(public payload: DiaryLoadParameters) {}
}

export class Create implements Action {
    readonly type = SessionActionTypes.Create;

    constructor(public payload: SessionCreate) {
        console.log(this.type);
    }
}

export class CreateComplete implements Action {
    readonly type = SessionActionTypes.CreateComplete;

    constructor() {
        console.log(this.type);
    }
}

export class CreateFailed implements Action {
    readonly type = SessionActionTypes.CreateFailed;

    constructor(public payload: string) {
        console.log(payload);
    }
}

export class UpsertMany implements Action {
    readonly type = SessionActionTypes.UpsertMany;

    constructor(public payload: Session[]) {
        console.log(this.type);
    }
}

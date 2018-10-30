import { Action } from '@ngrx/store';
import { Session } from '../models/session.model';
import { SessionQuery, SessionQueryForDates } from '../models/session-query.model';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';
import { SessionAmmend } from '../models/ammend/session-ammend.model';
import { SessionCreate } from '../models/session-create.model';

export enum SessionActionTypes {
  Search = '[Session] Search',
  Get = '[Session] Get',
  SearchForDates = '[Session] Search for given dates',
  SearchForJudge = '[Session] Search for judge',
  SearchForJudgeWithHearings = '[Session] Search for judge with hearings',
  SearchComplete = '[Session] Search Complete',
  SearchFailed = '[Session] Search Failed',
  Create = '[Session] Create',
  Update = '[Session] Update',
  Amend = '[Session] Amend',
  UpdateComplete = '[Session] Update Complete',
  UpdateFailed = '[Session] Update Failed',
  CreateComplete = '[Session] Create Complete',
  CreateAcknowledged = '[Session] Create Acknowledged',
  CreateFailed = '[Session] Create Failed',
  UpsertMany = '[Session] Upsert Many',
  UpsertOne = '[Session] Upsert One',
  DeleteOne = '[Session] Delete One'
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

  constructor(public payload: SessionQuery) {}
}

export class SearchComplete implements Action {
  readonly type = SessionActionTypes.SearchComplete;

  constructor(public payload: Session[]) {}
}

export class SearchFailed implements Action {
  readonly type = SessionActionTypes.SearchFailed;

  constructor(public payload: any) {}
}

export class SearchForDates implements Action {
    readonly type = SessionActionTypes.SearchForDates;

    constructor(public payload: SessionQueryForDates) {}
}

export class SearchForJudge implements Action {
    readonly type = SessionActionTypes.SearchForJudge;

    constructor(public payload: DiaryLoadParameters) {}
}

export class SearchForJudgeWithHearings implements Action {
    readonly type = SessionActionTypes.SearchForJudgeWithHearings;

    constructor(public payload: DiaryLoadParameters) {}
}

export class Create implements Action {
    readonly type = SessionActionTypes.Create;

    constructor(public payload: SessionCreate) {}
}

export class Get implements Action {
    readonly type = SessionActionTypes.Get;

    constructor(public payload: string) {}
}

export class Update implements Action {
    readonly type = SessionActionTypes.Update;

    constructor(public payload: any) {}
}

export class Amend implements Action {
    readonly type = SessionActionTypes.Amend;

    constructor(public payload: SessionAmmend) {}
}

export class CreateComplete implements Action {
    readonly type = SessionActionTypes.CreateComplete;

    constructor(public payload: string) {}
}

export class UpdateComplete implements Action {
    readonly type = SessionActionTypes.UpdateComplete;

    constructor() {}
}

export class UpdateFailed {
    readonly type = SessionActionTypes.UpdateFailed;

    constructor(public payload: string) {}
}

export class CreateFailed implements Action {
    readonly type = SessionActionTypes.CreateFailed;

    constructor(public payload: string) {}
}

export class UpsertMany implements Action {
    readonly type = SessionActionTypes.UpsertMany;

    constructor(public payload: Session[]) {}
}

export class UpsertOne implements Action {
    readonly type = SessionActionTypes.UpsertOne;

    constructor(public payload: Session) {}
}

export class DeleteOne implements Action {
    readonly type = SessionActionTypes.DeleteOne;

    constructor(public payload: string) {}
}

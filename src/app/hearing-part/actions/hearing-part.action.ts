import { Action } from '@ngrx/store';
import { HearingPart } from '../models/hearing-part';
import { SessionAssignment } from '../models/session-assignment';
import { ListingCreate } from '../models/listing-create';

export enum HearingPartActionTypes {
  Search = '[HearingPart] Search',
  SearchComplete = '[HearingPart] Search Complete',
  SearchFailed = '[HearingPart] Search Failed',
  Create = '[HearingPart] Create',
  CreateListingRequest = '[HearingPart] Create Listing Request',
  CreateComplete = '[HearingPart] Create Complete',
  CreateFailed = '[HearingPart] Create Failed',
  AssignToSession = '[HearingPart] Assign to session',
  AssignComplete = '[HearingPart] Assign Complete',
  UpsertMany = '[HearingPart] Upsert Many',
  AssignFailed = '[HearingPart] Assign Failed'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class Search implements Action {
  readonly type = HearingPartActionTypes.Search;

  constructor() {}
}

export class SearchComplete implements Action {
  readonly type = HearingPartActionTypes.SearchComplete;

  constructor(public payload: HearingPart[]) {}
}

export class SearchFailed implements Action {
  readonly type = HearingPartActionTypes.SearchFailed;

  constructor(public payload: string) {}
}

export class Create implements Action {
    readonly type = HearingPartActionTypes.Create;

    constructor(public payload: HearingPart) {}
}

export class CreateListingRequest implements Action {
    readonly type = HearingPartActionTypes.CreateListingRequest;

    constructor(public payload: ListingCreate) {}
}

export class CreateComplete implements Action {
    readonly type = HearingPartActionTypes.CreateComplete;

    constructor() {}
}

export class CreateFailed implements Action {
    readonly type = HearingPartActionTypes.CreateFailed;

    constructor(public payload: string) {}
}

export class AssignToSession implements Action {
    readonly type = HearingPartActionTypes.AssignToSession;

    constructor(public payload: SessionAssignment) {}
}

export class AssignComplete implements Action {
    readonly type = HearingPartActionTypes.AssignComplete;

    constructor(public payload: any) {}
}

export class AssignFailed implements Action {
    readonly type = HearingPartActionTypes.AssignFailed;

    constructor(public payload: string) {}
}

export class UpsertMany implements Action {
    readonly type = HearingPartActionTypes.UpsertMany;

    constructor(public payload: string) {}
}

import { Action } from '@ngrx/store';
import { HearingPart } from '../models/hearing-part';
import { SessionAssignment } from '../models/session-assignment';
import { ListingCreate } from '../models/listing-create';

export enum HearingPartActionTypes {
  GetById = '[HearingPart] Get by id',
  Search = '[HearingPart] Search',
  SearchComplete = '[HearingPart] Search Complete',
  SearchFailed = '[HearingPart] Search Failed',
  Create = '[HearingPart] Create',
  CreateListingRequest = '[HearingPart] Create Listing Request',
  UpdateListingRequest = '[HearingPart] Update Listing Request',
  CreateComplete = '[HearingPart] Create Complete',
  CreateFailed = '[HearingPart] Create Failed',
  AssignToSession = '[HearingPart] Assign to session',
  UpsertMany = '[HearingPart] Upsert Many',
  UpsertOne = '[HearingPart] Upsert One',
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

  constructor(public payload?: object) {}
}

export class GetById implements Action {
  readonly type = HearingPartActionTypes.GetById;

  constructor(public payload: string) {}
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

export class UpdateListingRequest implements Action {
    readonly type = HearingPartActionTypes.UpdateListingRequest;

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

export class UpsertMany implements Action {
    readonly type = HearingPartActionTypes.UpsertMany;

    constructor(public payload: string) {}
}

export class UpsertOne implements Action {
    readonly type = HearingPartActionTypes.UpsertOne;

    constructor(public payload: any) {}
}

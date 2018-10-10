import { Action } from '@ngrx/store';
import { HearingPart } from '../models/hearing-part';
import { HearingToSessionAssignment } from '../models/hearing-to-session-assignment';
import { ListingCreate } from '../models/listing-create';
import { HearingPartDeletion } from '../models/hearing-part-deletion';
import { CreateHearingRequest } from '../models/create-hearing-request';
import { HearingPartResponse } from '../models/hearing-part-response';

export enum HearingActionTypes {
  GetById = '[Hearing] Get by id',
  Search = '[Hearing] Search',
  SearchFailed = '[Hearing] Search Failed',
  SearchComplete = '[Hearing] Search Complete',
  Create = '[Hearing] Create',
  CreateListingRequest = '[Hearing] Create Listing Request',
  UpdateListingRequest = '[Hearing] Update Listing Request',
  CreateComplete = '[Hearing] Create Complete',
  CreateFailed = '[Hearing] Create Failed',
  AssignToSession = '[Hearing] Assign to session',
  UpsertMany = '[Hearing] Upsert Many',
  UpsertOne = '[Hearing] Upsert One',
  AssignFailed = '[Hearing] Assign Failed',
  Delete = '[Hearing] Delete',
  DeleteComplete = '[Hearing] Delete Complete',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class Search implements Action {
  readonly type = HearingActionTypes.Search;

  constructor(public payload?: object) {}
}

export class GetById implements Action {
  readonly type = HearingActionTypes.GetById;

  constructor(public payload: string) {}
}

export class SearchComplete implements Action {
  readonly type = HearingActionTypes.SearchComplete;

  constructor(public payload: HearingPartResponse[]) {}
}

export class SearchFailed implements Action {
  readonly type = HearingActionTypes.SearchFailed;

  constructor(public payload: string) {}
}

export class Create implements Action {
    readonly type = HearingActionTypes.Create;

    constructor(public payload: HearingPart) {}
}

export class CreateListingRequest implements Action {
    readonly type = HearingActionTypes.CreateListingRequest;

    constructor(public payload: CreateHearingRequest) {}
}

export class UpdateListingRequest implements Action {
    readonly type = HearingActionTypes.UpdateListingRequest;

    constructor(public payload: ListingCreate) {}
}

export class CreateComplete implements Action {
    readonly type = HearingActionTypes.CreateComplete;

    constructor() {}
}

export class CreateFailed implements Action {
    readonly type = HearingActionTypes.CreateFailed;

    constructor(public payload: string) {}
}

export class AssignToSession implements Action {
    readonly type = HearingActionTypes.AssignToSession;

    constructor(public payload: HearingToSessionAssignment) {}
}

export class UpsertMany implements Action {
    readonly type = HearingActionTypes.UpsertMany;

    constructor(public payload: string) {}
}

export class UpsertOne implements Action {
    readonly type = HearingActionTypes.UpsertOne;

    constructor(public payload: any) {}
}

export class Delete implements Action {
  readonly  type = HearingActionTypes.Delete;

  constructor(public payload: HearingPartDeletion) {}
}

export class DeleteComplete implements Action {
  readonly  type = HearingActionTypes.DeleteComplete;

  constructor(public payload: any) {}
}

import { Action } from '@ngrx/store';
import { HearingPart } from '../models/hearing-part';

export enum HearingPartActionTypes {
  Search = '[HearingPart] Search',
  SearchComplete = '[HearingPart] Search Complete',
  SearchFailed = '[HearingPart] Search Failed',
  Create = '[HearingPart] Create',
  CreateComplete = '[HearingPart] Create Complete',
  CreateFailed = '[HearingPart] Create Failed'
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

  constructor() {
      console.log(this.type);
  }
}

export class SearchComplete implements Action {
  readonly type = HearingPartActionTypes.SearchComplete;

  constructor(public payload: HearingPart[]) {
    console.log('Action: searchComplete');
  }
}

export class SearchFailed implements Action {
  readonly type = HearingPartActionTypes.SearchFailed;

  constructor(public payload: string) {
      console.log(this.type);
  }
}

export class Create implements Action {
    readonly type = HearingPartActionTypes.Create;

    constructor(public payload: HearingPart) {
        console.log(this.type);
    }
}

export class CreateComplete implements Action {
    readonly type = HearingPartActionTypes.CreateComplete;

    constructor() {
        console.log(this.type);
    }
}

export class CreateFailed implements Action {
    readonly type = HearingPartActionTypes.CreateFailed;

    constructor(public payload: string) {
        console.log(payload);
    }
}

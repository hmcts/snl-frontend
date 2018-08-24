import { Action } from '@ngrx/store';
import { CaseType } from '../models/case-type';
import { HearingType } from '../models/hearing-type';

export enum ReferenceDataActionTypes {
    GetAll = '[] Get All',
    GetAllCaseType = '[] Get All case types',
    GetAllCaseTypeComplete = '[] Get All Case Types Complete',
    GetAllHearingType = '[] Get All hearing types',
    GetAllHearingTypeComplete = '[] Get All Hearing Types Complete',
    GetFailed = '[] Get reference data failed'
}

export class GetAll implements Action {
  readonly type = ReferenceDataActionTypes.GetAll;

  constructor() {}
}

export class GetAllCaseType implements Action {
  readonly type = ReferenceDataActionTypes.GetAllCaseType;

  constructor() {}
}

export class GetAllCaseTypeComplete implements Action {
  readonly type = ReferenceDataActionTypes.GetAllCaseTypeComplete;

  constructor(public payload: CaseType[]) {}
}

export class GetAllHearingType implements Action {
    readonly type = ReferenceDataActionTypes.GetAllHearingType;

    constructor() {}
}

export class GetAllHearingTypeComplete implements Action {
    readonly type = ReferenceDataActionTypes.GetAllHearingTypeComplete;

    constructor(public payload: HearingType[] ) {}
}

export class GetFailed implements Action {
  readonly type = ReferenceDataActionTypes.GetFailed;

  constructor(public payload: string) {}
}

export type ReferenceDataActions
    = GetAllCaseType
    | GetAllCaseTypeComplete
    | GetAllHearingType
    | GetAllHearingTypeComplete
    | GetAll
    | GetFailed;

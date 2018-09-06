import { Action } from '@ngrx/store';
import { CaseType } from '../models/case-type';
import { HearingType } from '../models/hearing-type';
import { RoomType } from '../models/room-type';
import { SessionType } from '../models/session-type';

export enum ReferenceDataActionTypes {
    GetAll = '[] Get All',
    GetAllCaseType = '[] Get All case types',
    GetAllCaseTypeComplete = '[] Get All Case Types Complete',
    GetAllHearingType = '[] Get All hearing types',
    GetAllHearingTypeComplete = '[] Get All Hearing Types Complete',
    GetAllRoomType = '[] Get All room types',
    GetAllRoomTypeComplete = '[] Get All Room Types Complete',
    GetAllSessionType = '[] Get All session types',
    GetAllSessionTypeComplete = '[] Get All Session Types Complete',
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

export class GetAllRoomType implements Action {
    readonly type = ReferenceDataActionTypes.GetAllRoomType;

    constructor() {}
}

export class GetAllRoomTypeComplete implements Action {
    readonly type = ReferenceDataActionTypes.GetAllRoomTypeComplete;

    constructor(public payload: RoomType[]) {}
}

export class GetAllSessionType implements Action {
    readonly type = ReferenceDataActionTypes.GetAllSessionType;

    constructor() {}
}

export class GetAllSessionTypeComplete implements Action {
    readonly type = ReferenceDataActionTypes.GetAllSessionTypeComplete;

    constructor(public payload: SessionType[]) {}
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
    | GetAllRoomType
    | GetAllRoomTypeComplete
    | GetAllSessionType
    | GetAllSessionTypeComplete
    | GetAll
    | GetFailed;

import { Action } from '@ngrx/store';
import { ListingCreate } from '../models/listing-create';

export enum HearingPartActionTypes {
    Create = '[HearingPart] Create',
    CreateComplete = '[HearingPart] Create Complete',
    CreateFailed = '[HearingPart] Create Failed'
}

export class Create implements Action {
    readonly type = HearingPartActionTypes.Create;

    constructor(public payload: ListingCreate) {
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

    constructor(public payload: any) {
        console.log(payload);
    }
}

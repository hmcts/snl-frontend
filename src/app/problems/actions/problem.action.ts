import { Action } from '@ngrx/store';
import { Problem } from '../models/problem.model';

export enum ProblemActionTypes {
    Get = '[Problem] Get',
    GetComplete = '[Problem] Get Complete',
    GetFailed = '[Problem] Get Failed',
    GetForSession = '[Problem] Get For session',
    UpsertMany = '[Problem] UpsertMany'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class Get implements Action {
    readonly type = ProblemActionTypes.Get;

    constructor() {
        console.log(this.type);
    }
}

export class GetForSession implements Action {
    readonly type = ProblemActionTypes.GetForSession;

    constructor(public payload: string | number | String) {
        console.log(this.type);
    }
}

export class GetComplete implements Action {
    readonly type = ProblemActionTypes.GetComplete;

    constructor(public payload: Problem[]) {
        console.log(this.type);
        console.log(payload);
    }
}

export class UpsertMany implements Action {
    readonly type = ProblemActionTypes.UpsertMany;

    constructor(public payload: Problem[]) {
        console.log(this.type);
        console.log(payload);
    }
}

export class GetFailed implements Action {
    readonly type = ProblemActionTypes.GetFailed;

    constructor(public payload: String) {
        console.log(this.type);
    }
}

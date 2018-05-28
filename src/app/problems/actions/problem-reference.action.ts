import { Action } from '@ngrx/store';
import { ProblemReference } from '../models/problem-reference.model';

export enum ProblemReferenceActionTypes {
    UpsertMany = '[ProblemReference] UpsertMany'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class UpsertMany implements Action {
    readonly type = ProblemReferenceActionTypes.UpsertMany;

    constructor(public payload: ProblemReference[]) {
    }
}

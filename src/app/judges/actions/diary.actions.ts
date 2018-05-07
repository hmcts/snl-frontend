import { Action } from '@ngrx/store';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';
import { SessionActionTypes } from '../../sessions/actions/session.action';
import { Session } from '../../sessions/models/session.model';

export enum DiaryActionTypes {
    DiaryLoadSessions = '[Diary] Load Sesions',
    DiaryLoadFailed = '[Diary] Load Failed',
    DiaryLoadComplete = '[Diary] Load Complete'
}

export class Load implements Action {
    readonly type = DiaryActionTypes.DiaryLoadSessions;

    constructor(public payload: DiaryLoadParameters) {
    }
}

export class LoadFailed implements Action {
    readonly type = DiaryActionTypes.DiaryLoadFailed;

    constructor(public payload: string) {
        console.log('Action: loadFailed | ' + payload);
    }
}

export class LoadComplete implements Action {
    readonly type = DiaryActionTypes.DiaryLoadComplete;

    constructor(public payload: Session[]) {
        console.log('Action: loadComplete');
    }
}

export type DiaryActions = Load | LoadFailed | LoadComplete;

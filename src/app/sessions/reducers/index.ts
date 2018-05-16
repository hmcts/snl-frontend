import * as fromRooms from '../../rooms/reducers/room.reducer'
import * as fromJudges from '../../judges/reducers/judge.reducer';
import * as fromJudgesIndex from '../../judges/reducers/index';
import * as fromHearingPartIndex from '../../hearing-part/reducers/index';
import * as fromSessions from './session.reducer'
import * as fromRoot from '../../app.state';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionViewModel } from '../models/session.viewmodel';

export interface SessionsState {
    readonly sessions: fromSessions.State;
    readonly rooms: fromRooms.State;
}

export interface State extends fromRoot.State {
    sessions: SessionsState;
}

export const reducers: ActionReducerMap<SessionsState> = {
    sessions: fromSessions.reducer,
    rooms: fromRooms.reducer,
};

export const getSessionsState = createFeatureSelector<SessionsState>('sessions');
export const getRoomsEntitiesState = createSelector(
    getSessionsState,
    state => state.rooms
);

export const getRooms = createSelector(
    getRoomsEntitiesState,
    state => state.entities
);

export const getSessionsEntitiesState = createSelector(
    getSessionsState,
    state => state.sessions
);

export const {
    selectIds: getSessionIds,
    selectEntities: getSessionEntities,
    selectAll: getAllSessions,
    selectTotal: getTotalSessions,
} = fromSessions.adapter.getSelectors(getSessionsEntitiesState);

export const getFullSessions = createSelector(getAllSessions, getRooms, fromJudgesIndex.getJudges, fromHearingPartIndex.getHearingParts,
    (sessions, rooms, judges, hearingParts) => {
        let finalSessions: SessionViewModel[];
        if (sessions === undefined) {return []};
        finalSessions = Object.keys(sessions).map(sessionKey => {
            let sessionData = sessions[sessionKey];
            return {
                id: sessionData.id,
                start: sessionData.start,
                duration: sessionData.duration,
                room: rooms[sessionData.room],
                person: judges[sessionData.person],
                caseType: sessionData.caseType,
                hearingParts: Object.values(hearingParts).filter(hearingPart => hearingPart.session === sessionData.id)
            } as SessionViewModel;
        });
        return Object.values(finalSessions);
    });

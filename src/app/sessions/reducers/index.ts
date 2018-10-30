import * as fromNotes from '../../notes/reducers/index';
import * as fromRooms from '../../rooms/reducers/room.reducer'
import * as fromJudgesIndex from '../../judges/reducers';
import * as fromHearingPartIndex from '../../hearing-part/reducers';
import * as fromSessions from './session.reducer'
import * as fromTransactions from '../../features/transactions/reducers/transaction.reducer'
import * as fromRoot from '../../app.state';
import * as fromReferenceData from '../../core/reference/reducers';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionViewModel } from '../models/session.viewmodel';
import { Session } from '../models/session.model';
import * as moment from 'moment';
import { Dictionary } from '@ngrx/entity/src/models';
import { SessionsStatisticsService } from '../services/sessions-statistics-service';
import { getRecentTransactionId, getTransactionsEntitiesState } from '../../features/transactions/reducers';
import { SessionType } from '../../core/reference/models/session-type';

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

export const getRecentlyCreatedSessionId = createSelector(
    getRecentTransactionId,
    getTransactionsEntitiesState,
    (transactionId, transactions) => {
        return transactions[transactionId].entityId;
    }
);

export const getSessionsLoading = createSelector(
    getSessionsEntitiesState,
    state => state.loading
);

export const getSessionsError = createSelector(
    getSessionsEntitiesState,
    state => state.error
);

export const {
    selectIds: getSessionIds,
    selectEntities: getSessionEntities,
    selectAll: getAllSessions,
    selectTotal: getTotalSessions,
} = fromSessions.adapter.getSelectors(getSessionsEntitiesState);

export const getFullSessions = createSelector(
    getAllSessions, getRooms, fromJudgesIndex.getJudges, fromHearingPartIndex.getFullHearingParts,
    fromReferenceData.selectSessionTypesDictionary, fromNotes.getNotes,
    (sessions, rooms, judges, inputHearingParts, sessionTypes, notes) => {
        let finalSessions: SessionViewModel[];
        if (sessions === undefined) {return []}
        finalSessions = Object.keys(sessions).map(sessionKey => {
            const sessionData: Session = sessions[sessionKey];
            const hearingParts = Object.values(inputHearingParts).filter(hearingPart => hearingPart.sessionId === sessionData.id);
            const allocated = calculateAllocated(hearingParts);
            const sessionType = (sessionTypes[sessionData.sessionTypeCode] === undefined) ?
                {code: 'N/A', description: 'N/A'} as SessionType :
                sessionTypes[sessionData.sessionTypeCode];

            const filteredNotes = Object.values(notes).filter(note => note.entityId === sessionData.id);
            const sortedNotes = [...filteredNotes].sort((left, right) => {
                return moment(right.createdAt).diff(moment(left.createdAt));
            })

            return {
                id: sessionData.id,
                start: moment(sessionData.start),
                duration: sessionData.duration,
                room: rooms[sessionData.room],
                person: judges[sessionData.person],
                sessionType: sessionType,
                hearingParts: hearingParts,
                jurisdiction: sessionData.jurisdiction,
                version: sessionData.version,
                allocated: allocated,
                utilization: calculateUtilized(sessionData.duration, allocated),
                available: calculateAvailable(sessionData.duration, allocated),
                notes: sortedNotes
            } as SessionViewModel;
        });

        return Object.values(finalSessions);
    });

let sessionsStatsService = new SessionsStatisticsService();

function calculateAllocated(hearingParts) {
  return sessionsStatsService.calculateAllocatedHearingsDuration({
    hearingParts: hearingParts
  });
}

function calculateUtilized(duration: number, allocated: moment.Duration): number {
  return sessionsStatsService.calculateUtilizedDuration(moment.duration(duration), allocated);
}

function calculateAvailable(duration: number, allocated: moment.Duration) {
  return sessionsStatsService.calculateAvailableDuration(moment.duration(duration), allocated);
}

export const getSessionViewModelById = (id: string) => createSelector(getFullSessions, (svm: SessionViewModel[]) => {
    return svm.find(s => s.id === id);
});

export const getSessionById = (id: string) => createSelector(getSessionEntities, (sessions: Dictionary<Session>) => {
    return sessions[id];
});

export const getRecentlyCreatedSession = createSelector(
    getAllSessions,
    fromTransactions.getRecent,
    (sessions, recentlyCreatedSessionId) => {
        return sessions[recentlyCreatedSessionId];
    }
);

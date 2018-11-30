import * as fromRoot from '../../app.state';
import * as fromHearingParts from './hearing-part.reducer';
import * as fromHearings from './hearing.reducer';
import * as fromReferenceData from '../../core/reference/reducers/index';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { getNotes } from '../../notes/reducers';
import { HearingPartViewModel } from '../models/hearing-part.viewmodel';
import { HearingPart } from '../models/hearing-part';
import { getJudgesEntities } from '../../judges/reducers';
import * as moment from 'moment';
import { Priority } from '../models/priority-model';
import { Status } from '../../core/reference/models/status.model';

export interface HearingPartsState {
    readonly hearingParts: fromHearingParts.State;
    readonly hearings: fromHearings.State;
}

export interface State extends fromRoot.State {
    hearingParts: HearingPartsState;
    hearings: HearingPartsState;
}

export const reducers: ActionReducerMap<HearingPartsState> = {
    hearingParts: fromHearingParts.reducer,
    hearings: fromHearings.reducer
};

export const getHearingPartsState = createFeatureSelector<HearingPartsState>('hearingParts');
export const getHearingPartsEntitiesState = createSelector(
    getHearingPartsState,
    state => state.hearingParts
);

export const getHearingsEntitiesState = createSelector(
    getHearingPartsState,
    state => state.hearings
);

export const getHearingsEntities = createSelector(
    getHearingsEntitiesState,
    fromHearings.getHearings
);

export const getHearingParts = createSelector(
    getHearingPartsEntitiesState,
    state => state.entities
);

export const {
    selectIds: getHearingPartsIds,
    selectEntities: getHearingPartsEntities,
    selectAll: getAllHearingParts,
    selectTotal: getTotalHearingParts,
} = fromHearingParts.adapter.getSelectors(getHearingPartsEntitiesState);

export const getFullHearingParts = createSelector(getAllHearingParts, getNotes, getJudgesEntities,
    fromReferenceData.selectHearingTypesDictionary, fromReferenceData.selectCaseTypesDictionary, getHearingsEntities,
    (hearingParts, notes, judges, hearingTypes, caseTypes, hearings) => {
        let finalHearingParts: HearingPartViewModel[];
        if ((hearingParts === undefined) || (hearings === undefined)) { return []; }
        finalHearingParts = hearingParts.map((hearingPart: HearingPart) => {
            const {id, sessionId, version, hearingInfo, start } = hearingPart;
            let hearing = hearings[hearingInfo];

            if (hearing === undefined) {
                return {} as HearingPartViewModel;
            }

            const filteredNotes = Object.values(notes).filter(note => note.entityId === hearingPart.id).map(
                note => {return {...note, createdAt: moment(note.createdAt)}}
            );
            const sortedNotes = [...filteredNotes].sort((left, right) => {
                return right.createdAt.diff(left.createdAt);
            });

            const scheduleStartObj = moment(hearing.scheduleStart);
            const scheduleEndObj = moment(hearing.scheduleEnd);
            return {
                id,
                sessionId,
                caseNumber: hearing.caseNumber,
                caseTitle: hearing.caseTitle,
                duration: moment.duration(hearing.duration),
                scheduleStart: scheduleStartObj.isValid() ? scheduleStartObj : undefined,
                scheduleEnd: scheduleEndObj.isValid() ? scheduleEndObj : undefined,
                version,
                reservedJudgeId: hearing.reservedJudgeId,
                communicationFacilitator: hearing.communicationFacilitator,
                priority: Priority[hearing.priority],
                caseType: caseTypes[hearing.caseTypeCode],
                hearingType: hearingTypes[hearing.hearingTypeCode],
                reservedJudge: judges[hearing.reservedJudgeId],
                hearingId: hearing.id,
                notes: sortedNotes,
                start: moment(start),
                multiSession: hearing.multiSession
            };
        });
        return finalHearingParts;
});

export const getFullHearings = createSelector(getAllHearingParts, getHearingsEntities, getNotes, getJudgesEntities,
    fromReferenceData.selectHearingTypesDictionary, fromReferenceData.selectCaseTypesDictionary,
    (hearingParts, hearingsEntities, notes, judges, hearingTypes, caseTypes) => {
        let hearings = Object.values(hearingsEntities).map(h => {
            const filteredNotes = Object.values(notes).filter(note => note.entityId === h.id);
            const sortedNotes = [...filteredNotes].sort((left, right) => {
                return moment(right.createdAt).diff(moment(left.createdAt));
            });

            const ownedHearingParts = hearingParts.filter(hp => hp.hearingInfo === h.id);
            const unlisted = ownedHearingParts.filter(hp => hp.sessionId === null).length !== 0;

            const scheduleStartObj = moment(h.scheduleStart);
            const scheduleEndObj = moment(h.scheduleEnd);
            return {
                id: h.id,
                caseNumber: h.caseNumber,
                caseTitle: h.caseTitle,
                duration: moment.duration(h.duration),
                scheduleStart: scheduleStartObj.isValid() ? scheduleStartObj : undefined,
                scheduleEnd: scheduleEndObj.isValid() ? scheduleEndObj : undefined,
                version: h.version,
                reservedJudgeId: h.reservedJudgeId,
                communicationFacilitator: h.communicationFacilitator,
                priority: Priority[h.priority],
                caseType: caseTypes[h.caseTypeCode],
                hearingType: hearingTypes[h.hearingTypeCode],
                reservedJudge: judges[h.reservedJudgeId],
                notes: sortedNotes,
                isListed: !unlisted,
                numberOfSessions: h.numberOfSessions,
                multiSession: h.multiSession,
                status: h.status
            }
        });

        return hearings;
    }
);

export const getFullUnlistedHearings = createSelector(
    getFullHearings,
    hearings => {
        return hearings.filter(h => h.status === Status.Unlisted)
    }
);

export const getHearingPartsLoading = createSelector(
    getHearingPartsEntitiesState,
    state => state.loading
);

export const getHearingPartsError = createSelector(
    getHearingPartsEntitiesState,
    state => state.error
);

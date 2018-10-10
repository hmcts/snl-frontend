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
            const {id, sessionId, version, hearingInfo } = hearingPart;
            console.log(hearings);
            let hearing = hearings[hearingInfo];

            if(hearing === undefined) {
                return {};
            }

            const filteredNotes = Object.values(notes).filter(note => note.entityId === hearingPart.id);
            const sortedNotes = [...filteredNotes].sort((left, right) => {
                return moment(right.createdAt).diff(moment(left.createdAt));
            })

            const scheduleStartObj = moment(hearing.scheduleStart)
            const scheduleEndObj = moment(hearing.scheduleEnd)
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
                hearingVersion: hearing.version,
                notes: sortedNotes,
            };
        });
        return finalHearingParts;
});

export const getFullHearings = createSelector(
    getFullHearingParts,
    hearingParts => {
        let uniqueHearingIds = hearingParts.map(hp => hp.hearingId)
            .filter((value, index, self) => self.indexOf(value) === index);
        let uniqueHearings = [];
        uniqueHearingIds.forEach(id => {
            uniqueHearings.push(hearingParts.find(hp => hp.hearingId === id));
        });

        uniqueHearings = uniqueHearings.map(uh => {
            return {
                id: uh.hearingId,
                caseNumber: uh.caseNumber,
                caseTitle: uh.caseTitle,
                duration: uh.duration,
                scheduleStart: uh.scheduleStart,
                scheduleEnd: uh.scheduleEnd,
                version: uh.hearingVersion,
                reservedJudgeId: uh.reservedJudgeId,
                communicationFacilitator: uh.communicationFacilitator,
                priority: uh.priority,
                caseType: uh.caseType,
                hearingType: uh.hearingType,
                reservedJudge: uh.reservedJudge,
                notes: uh.notes,
                isListed: uh.sessionId !== null
            }
        })

        return uniqueHearings;
    }
);

export const getFullUnlistedHearings = createSelector(
    getFullHearings,
    hearings => {
        return hearings.filter(h => !h.isListed)
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

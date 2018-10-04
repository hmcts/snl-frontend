import * as fromRoot from '../../app.state';
import * as fromHearingParts from './hearing-part.reducer';
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
}

export interface State extends fromRoot.State {
    hearingParts: HearingPartsState;
}

export const reducers: ActionReducerMap<HearingPartsState> = {
    hearingParts: fromHearingParts.reducer,
};

export const getHearingPartsState = createFeatureSelector<HearingPartsState>('hearingParts');
export const getHearingPartsEntitiesState = createSelector(
    getHearingPartsState,
    state => state.hearingParts
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
    fromReferenceData.selectHearingTypesDictionary, fromReferenceData.selectCaseTypesDictionary,
    (hearingParts, notes, judges, hearingTypes, caseTypes) => {
        let finalHearingParts: HearingPartViewModel[];
        if (hearingParts === undefined) { return []; }
        finalHearingParts = hearingParts.map((hearingPart: HearingPart) => {
            const {id, sessionId, caseNumber, caseTitle, duration, priority,
                scheduleStart, scheduleEnd, version, reservedJudgeId, communicationFacilitator} = hearingPart
                const scheduleStartObj = moment(scheduleStart)
                const scheduleEndObj = moment(scheduleEnd)
            return {
                id,
                sessionId,
                caseNumber,
                caseTitle,
                duration: moment.duration(duration),
                scheduleStart: scheduleStartObj.isValid() ? scheduleStartObj : undefined,
                scheduleEnd: scheduleEndObj.isValid() ? scheduleEndObj : undefined,
                version,
                reservedJudgeId,
                communicationFacilitator,
                priority: Priority[priority],
                caseType: caseTypes[hearingPart.caseTypeCode],
                hearingType: hearingTypes[hearingPart.hearingTypeCode],
                reservedJudge: judges[hearingPart.reservedJudgeId],
                notes: Object.values(notes).filter(note => note.entityId === hearingPart.id),
            };
        });
        return finalHearingParts;
    });

export const getHearingPartsLoading = createSelector(
    getHearingPartsEntitiesState,
    state => state.loading
);

export const getHearingPartsError = createSelector(
    getHearingPartsEntitiesState,
    state => state.error
);

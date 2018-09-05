import * as fromCaseType from './case-type.reducer';
import * as fromHearingType from './hearing-type.reducer';
import * as fromRoomType from './room-type.reducer';
import * as fromSessionType from './session-type.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const fromCaseTypesState = createFeatureSelector<fromCaseType.CaseTypeState>('caseTypes');
export const fromHearingTypesState = createFeatureSelector<fromHearingType.HearingTypeState>('hearingTypes');
export const fromRoomTypesState = createFeatureSelector<fromRoomType.RoomTypeState>('roomTypes');
export const fromSessionTypesState = createFeatureSelector<fromSessionType.SessionTypeState>('sessionTypes');

export const selectCaseTypes = createSelector(
    fromCaseTypesState,
    fromCaseType.selectAll
);

export const selectCaseTypesDictionary = createSelector(
    fromCaseTypesState,
    fromCaseType.selectEntities
);

export const selectHearingTypes = createSelector(
    fromHearingTypesState,
    fromHearingType.selectAll
);

export const selectHearingTypesDictionary = createSelector(
    fromHearingTypesState,
    fromHearingType.selectEntities
);

export const selectRoomTypes = createSelector(
    fromRoomTypesState,
    fromRoomType.selectAll
);

export const selectSessionTypes = createSelector(
    fromSessionTypesState,
    fromSessionType.selectAll
);

export const selectSessionTypesDictionary = createSelector(
    fromSessionTypesState,
    fromSessionType.selectEntities
);
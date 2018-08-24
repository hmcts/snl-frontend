import * as fromCaseType from './case-type.reducer';
import * as fromHearingType from './hearing-type.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const fromCaseTypesState = createFeatureSelector<fromCaseType.CaseTypeState>('caseTypes');
export const fromHearingTypesState = createFeatureSelector<fromHearingType.HearingTypeState>('hearingTypes');

export const selectCaseTypes = createSelector(
    fromCaseTypesState,
    fromCaseType.selectAll
);

export const selectHearingTypes = createSelector(
    fromHearingTypesState,
    fromHearingType.selectAll
);

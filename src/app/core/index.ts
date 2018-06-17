import * as fromNotification from '../features/notification/reducers/notification.reducer'
import * as fromRoot from '../app.state';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface CoreState {
    notification: fromNotification.State;
}

export interface State extends fromRoot.State {
    notification: CoreState;
}

export const reducers: ActionReducerMap<CoreState> = {
    notification: fromNotification.reducer
};

export const selectCoreState = createFeatureSelector<CoreState>('core');

export const selectNotificationState = createSelector(
    selectCoreState,
    (state: CoreState) => state.notification
);

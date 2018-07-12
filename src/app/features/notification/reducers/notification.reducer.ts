
import { CoreNotification } from '../model/core-notification';
import { NotificationActionTypes } from '../actions/notification.action';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export interface State {
    notification: CoreNotification,
    isDismissed: boolean
}

export const adapter: EntityAdapter<CoreNotification> = createEntityAdapter<CoreNotification>();

export const initialState: State = {
    notification: { message: '', duration: null },
    isDismissed: true
};

export function reducer(state: State = initialState, action) {
  switch (action.type) {
    case NotificationActionTypes.Create: {
        return {...state, notification: action.payload, isDismissed: false};
    }
    case NotificationActionTypes.Dismiss: {
        return {...state, isDismissed: true};
    }
    default:
        return state;
  }
}

export const getNotificationState = (state: State) => state;
export const getNotification = (state: State) => state.notification;
export const getIsDismissed = (state: State) => state.isDismissed;

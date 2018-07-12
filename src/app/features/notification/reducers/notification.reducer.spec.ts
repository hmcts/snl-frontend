import { initialState, reducer } from './notification.reducer';
import { CoreNotification } from '../model/core-notification';
import * as fromNotifications from '../actions/notification.action';

let notification = {
    message: 'test',
    duration: 1000
} as CoreNotification;

fdescribe('NotificationReducer', () => {

    describe('When creating a notification', () => {
        it('the notification should be in state', () => {
            let state = reducer(initialState, new fromNotifications.Notify(notification));

            expect(state.notification).toEqual(notification);
            expect(state.isDismissed).toEqual(false);
        });
    });

    describe('When opening', () => {
        it('a plain dialog the state should stay unchanged', () => {
            let state = reducer(initialState, new fromNotifications.OpenDialog('test'));

            expect(state).toEqual(initialState);
        });

        it('a dialog with action the state should stay unchanged', () => {
            let state = reducer(initialState, new fromNotifications.OpenDialogWithAction('test'));

            expect(state).toEqual(initialState);
        });
    })

    describe('When dismissing a notification', () => {
        it('a dismissed flag should be set', () => {
            let state = reducer(initialState, new fromNotifications.Notify(notification));

            state = reducer(state, new fromNotifications.Dismiss());

            expect(state.isDismissed).toEqual(true);
        });
    })
});

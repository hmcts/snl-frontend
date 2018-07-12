import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { NotificationEffects } from './notification.effects';
import * as fromNotifications from '../actions/notification.action';
import { CoreNotification } from '../model/core-notification';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReplaySubject } from 'rxjs/ReplaySubject';

let notification = {
    message: 'test',
    duration: 1000
} as CoreNotification;

fdescribe('NotificationEffects', () => {
    let effects: NotificationEffects;
    let actions: Observable<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AngularMaterialModule, NoopAnimationsModule
            ],
            providers: [
                NotificationEffects,
                provideMockActions(() => actions),
                // other providers
            ],
        });

        effects = TestBed.get(NotificationEffects);
    });

    fdescribe('When calling', () => {
        it('notify the notification function should be called with proper parameters', () => {
            actions = new ReplaySubject(1);
            let createNotificationSpy = spyOn(effects, 'createNotification');

            let notifyAction = new fromNotifications.Notify(notification);

            (actions as any).next(notifyAction);

            effects.create$.subscribe(() => {
                expect(createNotificationSpy).toHaveBeenCalledWith(notifyAction);
            });
        });

        it('open dialog the dialog function should be called with proper parameters', () => {
            actions = new ReplaySubject(1);
            let openDialogSpy = spyOn(effects, 'openDialog');

            let openDialogAction = new fromNotifications.OpenDialog('test');

            (actions as any).next(openDialogAction);

            effects.create$.subscribe(() => {
                expect(openDialogSpy).toHaveBeenCalledWith(openDialogAction);
            });
        });

        it('dialog with actions the dialog function should be called with proper parameters', () => {
            actions = new ReplaySubject(1);
            let openDialogWithActionSpy = spyOn(effects, 'openDialog');

            let openDialogWithActionAction = new fromNotifications.OpenDialogWithAction('test');

            (actions as any).next(openDialogWithActionAction);

            effects.create$.subscribe(() => {
                expect(openDialogWithActionSpy).toHaveBeenCalledWith(openDialogWithActionAction);
            });
        });
    })
});

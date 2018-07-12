import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { NotificationEffects } from './notification.effects';
import * as fromNotifications from '../actions/notification.action';
import { CoreNotification } from '../model/core-notification';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MatDialog, MatSnackBar } from '@angular/material';

let notification = {
    message: 'test',
    duration: 1000
} as CoreNotification;

let snackBarSpy, dialogSpy;

fdescribe('NotificationEffects', () => {
    let effects: NotificationEffects;
    let actions: Observable<any>;

    snackBarSpy = jasmine.createSpyObj('snackBarSpy', ['open']);
    dialogSpy = jasmine.createSpyObj('dialogSpy', ['open']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AngularMaterialModule, NoopAnimationsModule
            ],
            providers: [
                NotificationEffects,
                provideMockActions(() => actions),
                { provide: MatSnackBar, useValue: snackBarSpy },
                { provide: MatDialog, useValue: dialogSpy }
            ],
        });

        effects = TestBed.get(NotificationEffects);
    });

    fdescribe('When calling', () => {
        it('notify the notification function should be called with proper parameters', () => {
            actions = new ReplaySubject(1);

            let notifyAction = new fromNotifications.Notify(notification);

            (actions as any).next(notifyAction);

            effects.create$.subscribe(() => {
                expect(snackBarSpy.open).toHaveBeenCalled();
            });
        });

        it('open dialog the dialog function should be called with proper parameters', () => {
            actions = new ReplaySubject(1);
            let openDialogAction = new fromNotifications.OpenDialog('test');

            (actions as any).next(openDialogAction);

            effects.openDialog$.subscribe(() => {
                expect(dialogSpy.open.calls.first().args[1].data).toEqual('test');
            });
        });

        it('dialog with actions the dialog function should be called with proper parameters', () => {
            actions = new ReplaySubject(1);

            let openDialogWithActionAction = new fromNotifications.OpenDialogWithAction('test');

            (actions as any).next(openDialogWithActionAction);

            effects.openDialogWithAction$.subscribe(() => {
                expect(dialogSpy.open.calls.first().args[1].data).toEqual('test');
            });
        });
    })
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { SessionsAmendFormComponent } from './sessions-amend-form.component';
import { SessionsCreationService } from '../../services/sessions-creation.service';
import { Session } from '../../models/session.model';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

let fixture: ComponentFixture<SessionsAmendFormComponent>;
let component: SessionsAmendFormComponent;

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

const openDialogMockObjConfirmed = {
    afterClosed: (): Observable<boolean> => Observable.of(true)
};

let now = moment();

let session = {
    id: 'id',
    start: now,
    duration: 60,
    room: 'room',
    person: 'person',
    caseType: 'caseType',
    sessionTypeCode: 'sessionTypeCode',
    jurisdiction: 'jurisdiction',
    version: 0
} as Session;

const sessionCreationServiceSpy = jasmine.createSpyObj('SessionsCreationService', ['amend', 'fetchUpdatedEntities']);

fdescribe('SessionsAmendFormComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AngularMaterialModule, FormsModule, ReactiveFormsModule],
            declarations: [SessionsAmendFormComponent],
            providers: [
                { provide: SessionsCreationService, useValue: sessionCreationServiceSpy },
                { provide: MatDialog, useValue: matDialogSpy }

            ]
        });
        fixture = TestBed.createComponent(SessionsAmendFormComponent);
        component = fixture.componentInstance;

        component.sessionData = session;
    });

    it('Should create', () => {
        expect(component).toBeDefined();
    });

    describe('When input sessionData is set', () => {
        it('the key variables should be set', () => {
            component.sessionData = session;

            expect(component.session).toEqual(session);
            expect(component.amendSessionForm).toBeDefined();
            expect(component.sessionAmendFormGroup).toBeDefined();
        });
    });

    describe('When amend', () => {
        it('the proper data is passed to the service', () => {
            component.sessionData = session;

            expect(component.session).toEqual(session);
            expect(component.amendSessionForm).toBeDefined();
            expect(component.sessionAmendFormGroup).toBeDefined();
        });

        it('the transaction dialog is open', () => {
            matDialogSpy.open.and.returnValue(openDialogMockObjConfirmed);

            component.sessionData = session;

            component.amend();

            expect(matDialogSpy.open).toHaveBeenCalled();
        });
    });

    describe('Form validations', () => {

        it('Should create', () => {
            expect(component).toBeDefined();
        });

        describe('StartDate field validation', () => {
            it(`should be disabled`, () => {
                let formGroupProperty = component.sessionAmendFormGroup.controls['startDate'];
                expect(formGroupProperty.disabled).toBeTruthy()
            });
        });

        describe('Require validators', () => {
            const propertiesNames = ['startTime', 'durationInMinutes', 'sessionTypeCode']

            propertiesNames.forEach((propertyName) => {
                it(`${propertyName} field validity`, () => {
                    let errors = {};
                    let formGroupProperty = component.sessionAmendFormGroup.controls[propertyName];
                    formGroupProperty.setValue('');
                    errors = formGroupProperty.errors || {};
                    expect(errors['required']).toBeTruthy()
                });
            })
        });

        describe('Min value validator', () => {
            it('duration should be invalid when equal to zero', () => {
                let errors = {};
                let formGroupProperty = component.sessionAmendFormGroup.controls['durationInMinutes'];
                formGroupProperty.setValue('0');
                errors = formGroupProperty.errors || {};
                expect(errors['min']).toBeTruthy()
            });

            it('duration should be valid when grater then zero', () => {
                let errors = {};
                let formGroupProperty = component.sessionAmendFormGroup.controls['durationInMinutes'];
                formGroupProperty.setValue('1');
                errors = formGroupProperty.errors || {};
                expect(errors['min']).toBeFalsy()
            });
        });
    });
});

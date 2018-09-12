import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { SessionsCreateFormComponent } from './sessions-amend-form.component';
import { SessionCreate } from '../../models/session-create.model';
import * as moment from 'moment';

let fixture: ComponentFixture<SessionsCreateFormComponent>;
let component: SessionsCreateFormComponent;

describe('SessionsCreateFormComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AngularMaterialModule, FormsModule, ReactiveFormsModule],
            declarations: [SessionsCreateFormComponent]
        });
        fixture = TestBed.createComponent(SessionsCreateFormComponent);
        component = fixture.componentInstance;
    });

    it('Should create', () => {
        expect(component).toBeDefined();
    });

    describe('Creating the session', () => {
        it('should generate unique session id on subsequent creations', () => {
            let spy = spyOn(component.createSessionAction, 'emit');

            // @ts-ignore: saveArgumentsByValue not existent in jasmine-types but still works and exists in documentation:
            // https://jasmine.github.io/api/2.8/Spy_calls.html
            spy.calls.saveArgumentsByValue();
            component.create();
            component.create();

            let firstSession = spy.calls.argsFor(0)[0];
            let secondSession = spy.calls.argsFor(1)[0];

            expect(firstSession.id).toBeDefined();
            expect(secondSession.id).toBeDefined();
            expect(firstSession.id).not.toEqual(secondSession.id);
        });
    });

    describe('Providing session data as input', () => {
        it('should make the view data recalculate', () => {
            expect(component.createSessionForm.durationInMinutes).toEqual(30);
            component.sessionData = {
                userTransactionId: 'uti',
                id: 'id',
                start: moment(),
                duration: 900,
                roomId: 'rid',
                personId: 'pid',
                caseType: 'CaseType',
            } as SessionCreate;

            expect(component.createSessionForm.durationInMinutes).toEqual(15);
            expect(component.createSessionForm.startDate).toBeDefined();
            expect(component.createSessionForm.startTime).toBeDefined();
        });
    });

    describe('Input placeholders should change depending on input flag', () => {
        it('for rooms', () => {

            expect(component.roomsPlaceholder).toEqual(SessionsCreateFormComponent.LOADING_ROOMS_PLACEHOLDER);

            component.roomsLoading = false;

            expect(component.roomsPlaceholder).toEqual(SessionsCreateFormComponent.SELECT_ROOM_PLACEHOLDER);
        });
        it('for judges', () => {

            expect(component.judgesPlaceholder).toEqual(SessionsCreateFormComponent.LOADING_JUDGES_PLACEHOLDER);

            component.judgesLoading = false;

            expect(component.judgesPlaceholder).toEqual(SessionsCreateFormComponent.SELECT_JUDGE_PLACEHOLDER);
        });
    });

    describe('Form validations', () => {
        it('on init form invalid', () => {
            expect(component.sessionCreateFormGroup.valid).toBeFalsy()
        });

        it('on init form invalid', () => {
            expect(component.sessionCreateFormGroup.valid).toBeFalsy()
        });

        describe('Require validators', () => {
            const propertiesNames = ['startDate', 'startTime', 'durationInMinutes', 'sessionTypeCode']

            propertiesNames.forEach((propertyName) => {
                it(`${propertyName} field validity`, () => {
                    let errors = {};
                    let formGroupProperty = component.sessionCreateFormGroup.controls[propertyName];
                    formGroupProperty.setValue('');
                    errors = formGroupProperty.errors || {};
                    expect(errors['required']).toBeTruthy()
                });
            })
        });

        describe('Min value validator', () => {
            it('duration should be invalid when equal to zero', () => {
                let errors = {};
                let formGroupProperty = component.sessionCreateFormGroup.controls['durationInMinutes'];
                formGroupProperty.setValue('0');
                errors = formGroupProperty.errors || {};
                expect(errors['min']).toBeTruthy()
            });

            it('duration should be valid when grater then zero', () => {
                let errors = {};
                let formGroupProperty = component.sessionCreateFormGroup.controls['durationInMinutes'];
                formGroupProperty.setValue('1');
                errors = formGroupProperty.errors || {};
                expect(errors['min']).toBeFalsy()
            });
        });
    });
});

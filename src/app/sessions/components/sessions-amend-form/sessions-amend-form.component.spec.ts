import { NoteComponent } from './../../../notes/components/note/note.component';
import { NoteListComponent } from './../../../notes/components/notes-list/note-list.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { SessionsAmendFormComponent } from './sessions-amend-form.component';
import { SessionsCreationService } from '../../services/sessions-creation.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { SessionToAmendSessionForm } from '../../mappers/amend-session-form-session-amend';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { SessionCreateNotesConfiguration } from '../../models/session-create-notes-configuration.model';
import { Store } from '@ngrx/store';
import { SessionAmendResponse } from '../../models/session-amend.response';

let fixture: ComponentFixture<SessionsAmendFormComponent>;
let component: SessionsAmendFormComponent;

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

const openDialogMockObjConfirmed = {
    afterClosed: (): Observable<boolean> => Observable.of(true)
};

let sessionSearchResponse: SessionAmendResponse = {
    id: 'id',
    start: moment().format(),
    duration: 'PT60M',
    sessionTypeCode: 'sessionTypeCode',
    personName: 'personName',
    roomName: 'roomName',
    roomDescription: 'roomDescription',
    roomTypeCode: 'roomTypeCode',
    hearingPartsCount: 0,
    hasMultiSessionHearingAssigned: false,
    version: 0,
    hasListedHearingParts: false
};

let session = SessionToAmendSessionForm(sessionSearchResponse);

const sessionCreationServiceSpy = jasmine.createSpyObj('SessionsCreationService', ['amend', 'fetchUpdatedEntities']);
const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);
const notePreparerSpy: jasmine.SpyObj<NotesPreparerService> = jasmine.createSpyObj('NotesPreparerService', ['prepare']);
notePreparerSpy.prepare.and.returnValue([])

describe('SessionsAmendFormComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AngularMaterialModule, FormsModule, ReactiveFormsModule],
            declarations: [NoteComponent, NoteListComponent, SessionsAmendFormComponent],
            providers: [
                { provide: SessionsCreationService, useValue: sessionCreationServiceSpy },
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: Store, useValue: storeSpy },
                { provide: NotesPreparerService, useValue: notePreparerSpy },
                SessionCreateNotesConfiguration,
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

            expect(component.amendSessionForm).toBeDefined();
            expect(component.sessionAmendFormGroup).toBeDefined();
        });
    });

    describe('When amend', () => {
        it('the proper data is passed to the service', () => {
            component.sessionData = session;

            expect(component.amendSessionForm).toBeDefined();
            expect(component.sessionAmendFormGroup).toBeDefined();
        });

        it('the transaction dialog is open', () => {
            matDialogSpy.open.and.returnValue(openDialogMockObjConfirmed);
            const noteListComponent: jasmine.SpyObj<NoteListComponent> = jasmine.createSpyObj('NoteListComponent', ['getModifiedNotes'])
            noteListComponent.getModifiedNotes.and.returnValue([]);
            component.newNoteList = noteListComponent;
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

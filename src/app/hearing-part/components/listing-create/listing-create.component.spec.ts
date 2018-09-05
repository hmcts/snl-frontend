import { Store, StoreModule } from '@ngrx/store';
import { ListingCreateComponent } from './listing-create.component';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NoteComponent } from '../../../notes/components/note/note.component';
import { CreateFailed, CreateListingRequest, HearingPartActionTypes, UpdateListingRequest } from '../../actions/hearing-part.action';
import { Note } from '../../../notes/models/note.model';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { ListingCreate } from '../../models/listing-create';
import { DurationFormatPipe } from '../../../core/pipes/duration-format.pipe';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as judgesReducers from '../../../judges/reducers';
import * as fromHearingParts from '../../reducers';
import * as caseTypeReducers from '../../../core/reference/reducers/case-type.reducer';
import * as referenceDataActions from '../../../core/reference/actions/reference-data.action';
import * as transactionsReducers from '../../../features/transactions/reducers';
import { Judge } from '../../../judges/models/judge.model';
import { DurationAsMinutesPipe } from '../../../core/pipes/duration-as-minutes.pipe';
import { ReferenceDataModule } from '../../../core/reference/reference-data.module';
import { CaseType } from '../../../core/reference/models/case-type';
import { Priority } from '../../models/priority-model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { JudgeEffects } from '../../../judges/effects/judge.effects';
import { HearingPartEffects } from '../../effects/hearing-part.effects';
import { ReferenceDataEffects } from '../../../core/reference/effects/reference-data.effects';
import { JudgeService } from '../../../judges/services/judge.service';
import { HearingPartService } from '../../services/hearing-part-service';
import { NotesModule } from '../../../notes/notes.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../core/core.module';
import { AppConfig } from '../../../app.config';
import { State } from '../../../app.state';
import { HearingType } from '../../../core/reference/models/hearing-type';
import * as hearingTypeReducers from '../../../core/reference/reducers/hearing-type.reducer';
import * as notesReducers from '../../../notes/reducers';
import { MatSelectChange } from '@angular/material';
import { HearingPartModificationService } from '../../services/hearing-part-modification-service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import moment = require('moment');

let storeSpy: jasmine.Spy;
let component: ListingCreateComponent;
let store: Store<State>;
let fixture: ComponentFixture<ListingCreateComponent>;
let listingCreateNoteConfig: ListingCreateNotesConfiguration;

let note;
let secondNote;

const now = moment();
const stubAppConfig = {getApiUrl: () => 'https://fake.url'};
const stubJudges: Judge[] = [{id: 'judge-id', name: 'some-judge-name'}];
const stubHearingTypes1: HearingType[] = [{code: 'hearing-type-code', description: 'hearing-type'}];
const stubHearingTypes2: HearingType[] = [{code: 'hearing-type-code2', description: 'hearing-type2'}];
const caseTypeWht1 = {code: 'case-type-code1', description: 'case-type1', hearingTypes: stubHearingTypes1} as CaseType;
const caseTypeWht2 = {code: 'case-type-code2', description: 'case-type1', hearingTypes: stubHearingTypes2} as CaseType;
const listingCreate = {
    hearingPart: {
        id: undefined,
        session: undefined,
        caseNumber: 'number',
        caseTitle: 'title',
        caseType: caseTypeWht1.code,
        hearingType: stubHearingTypes1[0].code,
        duration: moment.duration(30, 'minute'),
        scheduleStart: now,
        scheduleEnd: now,
        createdAt: now,
        version: 0,
        priority: undefined,
        reservedJudgeId: undefined,
        communicationFacilitator: undefined,
        userTransactionId: 'uti'
    },
    notes: [],
    userTransactionId: undefined
} as ListingCreate;

describe('ListingCreateComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                AngularMaterialModule,
                ReactiveFormsModule,
                NotesModule,
                FlexLayoutModule,
                CoreModule,
                FormsModule,
                StoreModule.forRoot({}),
                StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
                StoreModule.forFeature('judges', judgesReducers.reducers),
                StoreModule.forFeature('notes', notesReducers.reducers),
                StoreModule.forFeature('caseTypes', caseTypeReducers.reducer),
                StoreModule.forFeature('hearingTypes', hearingTypeReducers.reducer),
                StoreModule.forFeature('transactions', transactionsReducers.reducers),
                EffectsModule.forRoot([]),
                EffectsModule.forFeature([JudgeEffects, HearingPartEffects, ReferenceDataEffects]),
                BrowserAnimationsModule,
                ReferenceDataModule,
                HttpClientTestingModule
            ],
            declarations: [
                ListingCreateComponent,
                TransactionDialogComponent
            ],
            providers: [
                {provide: AppConfig, useValue: stubAppConfig},
                NoteComponent,
                NoteListComponent,
                NotesPreparerService,
                ListingCreateNotesConfiguration,
                Actions,
                DurationFormatPipe,
                DurationAsMinutesPipe,
                JudgeService,
                HearingPartService,
                HearingPartModificationService
            ]
        }).compileComponents();

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [TransactionDialogComponent]
            }
        });
    });

    beforeEach(() => {
        store = TestBed.get(Store);
        storeSpy = spyOn(store, 'dispatch').and.callThrough();

        store.dispatch(new referenceDataActions.GetAllCaseTypeComplete([caseTypeWht1]));
        store.dispatch(new JudgeActions.GetComplete(stubJudges));

        listingCreateNoteConfig = TestBed.get(ListingCreateNotesConfiguration);
        fixture = TestBed.createComponent(ListingCreateComponent);
        component = fixture.componentInstance;
        component.editMode = false;
    });

    describe('Initial state ', () => {
        it('should include priority', () => {
            expect(component.errors).toEqual('');
            expect(component.listing).toBeDefined();
            expect(component.listing.hearingPart.priority).toBe(Priority.Low);
        });

        it('should get judges from store', () => {
            expect(component.judges).toEqual(stubJudges);
        });

        it('should get caseTypes from store', () => {
            expect(component.caseTypes).toEqual([caseTypeWht1]);
        });
    });

    describe('ngOnInit', () => {
        it('should dispatch Get Judges action', () => {
            storeSpy.calls.reset();
            component.ngOnInit();
            const passedObj = storeSpy.calls.argsFor(0)[0];
            expect(passedObj instanceof JudgeActions.Get).toBeTruthy();
        });
    });

    describe('create', () => {
        beforeEach(() => {
            fixture.detectChanges();
            storeSpy.calls.reset();
            // @ts-ignore: non existent in @types
            storeSpy.calls.saveArgumentsByValue();

            note = {
                id: undefined,
                content: 'a',
                type: 't',
                entityId: undefined,
                entityType: 'e'
            } as Note;

            secondNote = {
                id: undefined,
                content: 'a',
                type: 't',
                entityId: undefined,
                entityType: 'e'
            } as Note;
        });

        it('with custom inputs should dispatch proper action', () => {
            component.listing = listingCreate;

            component.save();

            expect(storeSpy).toHaveBeenCalledTimes(3);

            const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;
            const createdListing = createListingAction.payload;

            expect(createListingAction.type).toEqual(
                HearingPartActionTypes.CreateListingRequest
            );
            expect(createdListing.hearingPart.id).toBeDefined();
            expect(createdListing.hearingPart.caseNumber).toEqual('number');
            expect(createdListing.hearingPart.caseType).toEqual('case-type-code1');
            expect(createdListing.hearingPart.hearingType).toEqual('hearing-type-code');
            expect(createdListing.hearingPart.scheduleStart).toEqual(now);
            expect(createdListing.hearingPart.scheduleEnd).toEqual(now);
            expect(createdListing.notes).toEqual([]);
        });

        it('with default inputs should dispatch proper action', () => {
            let defaultListing = component.listing;
            component.save();

            expect(storeSpy).toHaveBeenCalledTimes(3);

            const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;

            expect(createListingAction.type).toEqual(
                HearingPartActionTypes.CreateListingRequest
            );
            expect(createListingAction.payload.hearingPart).toEqual(defaultListing.hearingPart);
        });

        it('with some notes it should set default notes post-creation', () => {
            component.listing.notes = [{...note, content: 'custom content'}];

            component.save();
            component.afterCreate();

            expect(component.listing.notes).toEqual(
                listingCreateNoteConfig.defaultNotes()
            );

            it('should fail when start date is after end date', () => {
                component.listing.hearingPart.scheduleStart = moment();
                component.listing.hearingPart.scheduleEnd = moment().subtract(10, 'day');
                component.save();

                expect(component.success).toBe(false);
                expect(component.listing).toBeDefined();
                expect(component.listing.hearingPart.id).not.toBeUndefined();

                const createFailed = storeSpy.calls.mostRecent()
                    .args[0] as CreateFailed;
                expect(createFailed.type).toEqual(HearingPartActionTypes.CreateFailed);
            });

            it('If start date is undefined', () => {
                component.listing.hearingPart.scheduleStart = undefined;
                component.listing.hearingPart.scheduleEnd = moment();

                component.save();

                expect(storeSpy).toHaveBeenCalledTimes(3);
                expect(component.errors).toEqual('');
            });

            it('If end date is undefined', () => {
                component.listing.hearingPart.scheduleStart = moment();
                component.listing.hearingPart.scheduleEnd = undefined;

                component.save();

                expect(storeSpy).toHaveBeenCalledTimes(3);
                expect(component.errors).toEqual('');
            });

            it('should succeed when start date is before end date', () => {
                component.listing.hearingPart.scheduleStart = moment();
                component.listing.hearingPart.scheduleEnd = moment().add(10, 'day');
                component.save();

                const createFailed = storeSpy.calls.mostRecent()
                    .args[0] as CreateFailed;
                expect(createFailed.type).not.toEqual(
                    HearingPartActionTypes.CreateFailed
                );
                expect(component.listing).toBeDefined();
                expect(component.success).toBe(true);
            });

            it('should dispatch proper action', () => {
                component.save();

                expect(storeSpy).toHaveBeenCalledTimes(3);

                const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;

                expect(createListingAction.type).toEqual(
                    HearingPartActionTypes.CreateListingRequest
                );
            });

            it('should prepare listing request with id', () => {
                component.save();

                expect(storeSpy).toHaveBeenCalledTimes(3);

                const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;
                const createdListing = createListingAction.payload;

                expect(createdListing.hearingPart.id).toBeDefined();
            });
        });

        describe('should prepare notes', () => {
            let createListingAction;
            let createdListing;

            beforeEach(() => {
                fixture.detectChanges();
                spyOn(component.noteList, 'getModifiedNotes').and.callFake(() => [
                    note,
                    secondNote
                ]);

                component.save();

                createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;
                createdListing = createListingAction.payload;
            });

            it('with properly generated ids', () => {
                expect(createdListing.notes.length).toEqual(2);
                expect(createdListing.notes[0].id).toBeDefined();
                expect(createdListing.notes[1].id).toBeDefined();
                expect(createdListing.notes[0].id).not.toEqual(
                    createdListing.notes[1].id
                );
            });

            it('with properly generated parentIds', () => {
                expect(createdListing.notes[0].entityId).toEqual(createdListing.hearingPart.id);
                expect(createdListing.notes[1].entityId).toEqual(createdListing.hearingPart.id);
            });

            it('with properly generated entityType names', () => {
                expect(createdListing.notes[0].entityType).toEqual('ListingRequest');
                expect(createdListing.notes[1].entityType).toEqual('ListingRequest');
            });
        });

        describe('save with edit mode', () => {

            beforeEach(() => {
                component.editMode = true;
            });

            it('should call proper action', () => {
                component.save();

                const updateListingAction = storeSpy.calls.argsFor(0)[0] as UpdateListingRequest;

                expect(updateListingAction.type).toEqual(
                    HearingPartActionTypes.UpdateListingRequest
                );
            });

            it('should emit save', () => {
                let emitSpy = spyOn(component.onSave, 'emit');

                component.save();
                expect(emitSpy).toHaveBeenCalled();
            });
        });

        describe('set data', () => {
            it('should set listingrequest', () => {
                component.data = listingCreate;

                expect(component.listing).toEqual(listingCreate);
            });

            it('should set default notes if there are no notes in listing', () => {
                component.data = listingCreate;

                expect(component.listing.notes).toEqual(component.listingNotesConfig.defaultNotes());
            });
        });
    });

    describe('onCaseTypeChanged', () => {
        beforeEach(() => {
            store.dispatch(new referenceDataActions.GetAllCaseTypeComplete([caseTypeWht1, caseTypeWht2]));
            storeSpy.calls.reset();
            fixture = TestBed.createComponent(ListingCreateComponent);
            component = fixture.componentInstance;
        });

        it('should set hearings to caseType associated hearing types', () => {
            component.onCaseTypeChanged(new MatSelectChange(null, caseTypeWht2.code));
            expect(component.hearings).toBe(stubHearingTypes2);

            component.onCaseTypeChanged(new MatSelectChange(null, caseTypeWht1.code));
            expect(component.hearings).toBe(stubHearingTypes1);
        });

        it('empty value should set hearings to empty array', () => {
            component.onCaseTypeChanged(new MatSelectChange(null, null));
            expect(component.hearings).toEqual([]);

            component.onCaseTypeChanged(new MatSelectChange(null, undefined));
            expect(component.hearings).toEqual([]);
        });
    });
});

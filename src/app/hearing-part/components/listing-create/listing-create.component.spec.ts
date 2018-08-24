import { Store, StoreModule } from '@ngrx/store';
import { ListingCreateComponent } from './listing-create.component';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import * as fromHearingParts from '../../reducers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NoteComponent } from '../../../notes/components/note/note.component';
import {
  CreateFailed,
  CreateListingRequest,
  HearingPartActionTypes
} from '../../actions/hearing-part.action';
import { Note } from '../../../notes/models/note.model';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import moment = require('moment');
import { ListingCreate } from '../../models/listing-create';
import { DurationFormatPipe } from '../../../core/pipes/duration-format.pipe';
import { Priority } from '../../models/priority-model';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as judgesReducers from '../../../judges/reducers';
import { Judge } from '../../../judges/models/judge.model';
import { DurationAsMinutesPipe } from '../../../core/pipes/duration-as-minutes.pipe';

let storeSpy: jasmine.Spy;
let component: ListingCreateComponent;
let store: Store<fromHearingParts.State>;
let fixture: ComponentFixture<ListingCreateComponent>;
let listingCreateNoteConfig: ListingCreateNotesConfiguration;

let note;
let secondNote;
const mockedJudges: Judge[] = [{ id: 'judge-id', name: 'some-judge-name' }];

describe('ListingCreateComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        StoreModule.forFeature('judges', judgesReducers.reducers),
        BrowserAnimationsModule
      ],
      declarations: [
        ListingCreateComponent,
        NoteComponent,
        NoteListComponent,
        DurationFormatPipe,
        DurationAsMinutesPipe
      ],
      providers: [
        NoteListComponent,
        NotesPreparerService,
        ListingCreateNotesConfiguration
      ]
    });
    fixture = TestBed.createComponent(ListingCreateComponent);
    component = fixture.componentInstance;
    listingCreateNoteConfig = TestBed.get(ListingCreateNotesConfiguration);
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('Initial state ', () => {
    it('should include priority', () => {
      expect(component.errors).toEqual('');
      expect(component.listing).toBeDefined();
      expect(component.listing.hearingPart.priority).toBe(Priority.Low);
    });

    it('should get judges from store', () => {
        store.dispatch(new JudgeActions.GetComplete(mockedJudges))
        component.judges$.subscribe(judges => {
            expect(judges).toEqual(mockedJudges);
        });
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch Get Judges action', () => {
        component.ngOnInit()
        const passedObj = storeSpy.calls.argsFor(0)[0];
        expect(passedObj instanceof JudgeActions.Get).toBeTruthy();
    });
  });

  describe('create', () => {
    beforeEach(() => {
      fixture.detectChanges();
      storeSpy.calls.reset()
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
      let now = moment();
      component.listing = {
        hearingPart: {
            id: undefined,
            session: undefined,
            caseNumber: 'number',
            caseTitle: 'title',
            caseType: 'case type',
            hearingType: 'hearing type',
            duration: moment.duration(30, 'minute'),
            scheduleStart: now,
            scheduleEnd: now,
            createdAt: now,
            version: 0,
            priority: undefined,
            reservedJudgeId: undefined,
            communicationFacilitator: undefined,
        },
          notes: [],
          userTransactionId: undefined
      } as ListingCreate;

      component.save();

      expect(storeSpy).toHaveBeenCalledTimes(1);

      const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;
      const createdListing = createListingAction.payload;

      expect(createListingAction.type).toEqual(
        HearingPartActionTypes.CreateListingRequest
      );
      expect(createdListing.hearingPart.id).toBeDefined();
      expect(createdListing.hearingPart.caseNumber).toEqual('number');
      expect(createdListing.hearingPart.caseType).toEqual('case type');
      expect(createdListing.hearingPart.hearingType).toEqual('hearing type');
      expect(createdListing.hearingPart.scheduleStart).toEqual(now);
      expect(createdListing.hearingPart.scheduleEnd).toEqual(now);
      expect(createdListing.notes).toEqual([]);
    });

    it('with default inputs should dispatch proper action', () => {
      let defaultListing = component.listing;
      component.save();

      expect(storeSpy).toHaveBeenCalledTimes(1);

      const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;

      expect(createListingAction.type).toEqual(
        HearingPartActionTypes.CreateListingRequest
      );
      expect(createListingAction.payload.hearingPart).toEqual(defaultListing.hearingPart);
    });

    it('with some notes it should set default notes post-creation', () => {
      component.listing.notes = [{ ...note, content: 'custom content' }];

      component.save();

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

        expect(storeSpy).toHaveBeenCalledTimes(1);
        expect(component.errors).toEqual('');
      });

      it('If end date is undefined', () => {
        component.listing.hearingPart.scheduleStart = moment();
        component.listing.hearingPart.scheduleEnd = undefined;

        component.save();

        expect(storeSpy).toHaveBeenCalledTimes(1);
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
    });
    describe('should prepare notes', () => {
      it('should dispatch proper action', () => {
        component.save();

        expect(storeSpy).toHaveBeenCalledTimes(1);

        const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;

        expect(createListingAction.type).toEqual(
          HearingPartActionTypes.CreateListingRequest
        );
      });

    //   it('with some notes it should set default notes post-creation', () => {
    //     component.listing.notes = [{...note, content: 'custom content'}];
    //
    //     component.create();
    //
    //     expect(component.listing.notes).toEqual(listingCreateNoteConfig.defaultNotes());
    // });

    it('should prepare listing request with id', () => {

        component.save();

        expect(storeSpy).toHaveBeenCalledTimes(1);

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

        component.editMode = true;

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
        expect(createdListing.notes[0].entityId).toEqual(createdListing.id);
        expect(createdListing.notes[1].entityId).toEqual(createdListing.id);
      });

      it('with properly generated entityType names', () => {
        expect(createdListing.notes[0].entityType).toEqual('ListingRequest');
        expect(createdListing.notes[1].entityType).toEqual('ListingRequest');
      });
    });
  });
});

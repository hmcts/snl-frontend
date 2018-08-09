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
import { DurationAsMinutesPipe } from '../../../core/pipes/duration-as-minutes.pipe';
import { Priority } from '../../models/priority-model';

let storeSpy: jasmine.Spy;
let component: ListingCreateComponent;
let store: Store<fromHearingParts.State>;
let fixture: ComponentFixture<ListingCreateComponent>;
let listingCreateNoteConfig: ListingCreateNotesConfiguration;

let note;
let secondNote;

describe('ListingCreateComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        BrowserAnimationsModule
      ],
      declarations: [
        ListingCreateComponent,
        NoteComponent,
        NoteListComponent,
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
  });

  describe('Initial state ', () => {
    it('should include priority', () => {
      expect(component.errors).toEqual('');
      expect(component.listing).toBeDefined();
      expect(component.listing.priority).toBe(Priority.Low);

    });
  });

  describe('create', () => {
    beforeEach(() => {
      fixture.detectChanges();
      storeSpy = spyOn(store, 'dispatch');
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
        id: undefined,
        caseNumber: 'number',
        caseTitle: 'title',
        caseType: 'case type',
        hearingType: 'hearing type',
        duration: moment.duration(30, 'minute'),
        scheduleStart: now,
        scheduleEnd: now,
        createdAt: now,
        notes: []
      } as ListingCreate;

      component.create();

      expect(storeSpy).toHaveBeenCalledTimes(1);

      const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;
      const createdListing = createListingAction.payload;

      expect(createListingAction.type).toEqual(
        HearingPartActionTypes.CreateListingRequest
      );
      expect(createdListing.id).toBeDefined();
      expect(createdListing.caseNumber).toEqual('number');
      expect(createdListing.caseType).toEqual('case type');
      expect(createdListing.hearingType).toEqual('hearing type');
      expect(createdListing.scheduleStart).toEqual(now);
      expect(createdListing.scheduleEnd).toEqual(now);
      expect(createdListing.notes).toEqual([]);
    });

    it('with default inputs should dispatch proper action', () => {
      let defaultListing = component.listing;
      component.create();

      expect(storeSpy).toHaveBeenCalledTimes(1);

      const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;

      expect(createListingAction.type).toEqual(
        HearingPartActionTypes.CreateListingRequest
      );
      expect(createListingAction.payload).toEqual(defaultListing);
    });

    it('with some notes it should set default notes post-creation', () => {
      component.listing.notes = [{ ...note, content: 'custom content' }];

      component.create();

      expect(component.listing.notes).toEqual(
        listingCreateNoteConfig.defaultNotes()
      );

      it('should fail when start date is after end date', () => {
        component.listing.scheduleStart = moment();
        component.listing.scheduleEnd = moment().subtract(10, 'day');
        component.create();

        expect(component.success).toBe(false);
        expect(component.listing).toBeDefined();
        expect(component.listing.id).not.toBeUndefined();

        const createFailed = storeSpy.calls.mostRecent()
          .args[0] as CreateFailed;
        expect(createFailed.type).toEqual(HearingPartActionTypes.CreateFailed);
      });

      it('If start date is undefined', () => {
        component.listing.scheduleStart = undefined;
        component.listing.scheduleEnd = moment();

        component.create();

        expect(storeSpy).toHaveBeenCalledTimes(1);
        expect(component.errors).toEqual('');
      });

      it('If end date is undefined', () => {
        component.listing.scheduleStart = moment();
        component.listing.scheduleEnd = undefined;

        component.create();

        expect(storeSpy).toHaveBeenCalledTimes(1);
        expect(component.errors).toEqual('');
      });

      it('should succeed when start date is before end date', () => {
        component.listing.scheduleStart = moment();
        component.listing.scheduleEnd = moment().add(10, 'day');
        component.create();

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
        component.create();

        expect(storeSpy).toHaveBeenCalledTimes(1);

        const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;

        expect(createListingAction.type).toEqual(
          HearingPartActionTypes.CreateListingRequest
        );
      });

      it('with some notes it should set default notes post-creation', () => {
        component.listing.notes = [{...note, content: 'custom content'}];

        component.create();

        expect(component.listing.notes).toEqual(listingCreateNoteConfig.defaultNotes());
    });

    it('should prepare listing request with id', () => {

        component.create();

        expect(storeSpy).toHaveBeenCalledTimes(1);

        const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;
        const createdListing = createListingAction.payload;

        expect(createdListing.id).toBeDefined();
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

        component.create();

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

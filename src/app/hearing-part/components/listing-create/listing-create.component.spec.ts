import { Store, StoreModule } from '@ngrx/store';
import { ListingCreateComponent } from './listing-create.component';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import * as fromHearingParts from '../../reducers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NoteComponent } from '../../../notes/components/note/note.component';
import { CreateListingRequest, HearingPartActionTypes } from '../../actions/hearing-part.action';
import { Note } from '../../../notes/models/note.model';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import moment = require('moment');
import { ListingCreate } from '../../models/listing-create';

let storeSpy: jasmine.Spy;
let component: ListingCreateComponent;
let store: Store<fromHearingParts.State>;
let fixture: ComponentFixture<ListingCreateComponent>;

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
            declarations: [ListingCreateComponent, NoteComponent, NoteListComponent],
            providers: [NoteListComponent, NotesPreparerService, ListingCreateNotesConfiguration],
        });

        fixture = TestBed.createComponent(ListingCreateComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store);
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
      })

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

        expect(createListingAction.type).toEqual(HearingPartActionTypes.CreateListingRequest);
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

        expect(createListingAction.type).toEqual(HearingPartActionTypes.CreateListingRequest);
        expect(createListingAction.payload).toEqual(defaultListing);
    });

    it('should prepare listing request with id', () => {
        component.create();

        expect(storeSpy).toHaveBeenCalledTimes(1);

        const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;
        const createdListing = createListingAction.payload;

        expect(createdListing.id).toBeDefined();
    });

    describe('The action should not be sent', () => {
        it('If start date is after end date', () => {
            component.listing.scheduleStart = moment().add(1, 'day');
            component.listing.scheduleEnd = moment();

            expect(component.errors).not.toEqual('Start date should be before End date');

            component.create();

            expect(storeSpy).toHaveBeenCalledTimes(0);
            expect(component.errors).toEqual('Start date should be before End date');
        })

        it('If start date is undefined', () => {
            expect(component.errors).not.toEqual('Start date should be before End date');

            component.listing.scheduleStart = undefined;
            component.listing.scheduleEnd = moment();

            component.create();

            expect(storeSpy).toHaveBeenCalledTimes(0);
            expect(component.errors).toEqual('Start date should be before End date');
        })

        it('If end date is undefined', () => {
            expect(component.errors).not.toEqual('Start date should be before End date');

            component.listing.scheduleStart = moment();
            component.listing.scheduleEnd = undefined;

            component.create();

            expect(storeSpy).toHaveBeenCalledTimes(0);
            expect(component.errors).toEqual('Start date should be before End date');
        })
    })

    describe('should prepare notes', () => {
        let createListingAction;
        let createdListing;

        beforeEach(() => {
            fixture.detectChanges();
            spyOn(component.noteList, 'getModifiedNotes').and.callFake(() => [note, secondNote]);

            component.create();

            createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;
            createdListing = createListingAction.payload;
        })

        it('with properly generated ids', () => {
            expect(createdListing.notes.length).toEqual(2);
            expect(createdListing.notes[0].id).toBeDefined();
            expect(createdListing.notes[1].id).toBeDefined();
            expect(createdListing.notes[0].id).not.toEqual(createdListing.notes[1].id);
        });

        it('with properly generated parentIds', () => {
            expect(createdListing.notes[0].entityId).toEqual(createdListing.id);
            expect(createdListing.notes[1].entityId).toEqual(createdListing.id);
        });

        it('with properly generated entityType names', () => {
            expect(createdListing.notes[0].entityType).toEqual('ListingRequest');
            expect(createdListing.notes[1].entityType).toEqual('ListingRequest');
        });
    })
  });
});

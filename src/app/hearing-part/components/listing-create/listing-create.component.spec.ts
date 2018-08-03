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
import * as moment from 'moment';
import { Priority } from '../../models/priority-model';

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


    describe('Initial state ', () => {
        it('should include priority', () => {
            expect(component.errors).toBeUndefined();
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
      })

      it('should fail and update error when start date is before end date', () => {
          component.create();

          expect(component.errors).not.toBe('');
          expect(component.listing).toBeDefined();
          expect(component.listing.id).not.toBeUndefined();
          expect(component.success).toBe(false);
      });

      it('should succeed and when start date is after end date', () => {
          const spyStore = spyOn(store, 'dispatch').and.stub();

          const now = moment(moment.now());
          component.listing.scheduleStart = now;
          component.listing.scheduleEnd = now.add(1, 'day');
          component.create();

          const passedObj = spyStore.calls.argsFor(0)[0];
          expect(passedObj instanceof CreateListingRequest).toBeTruthy();
          expect(component.errors).toBe('');
          expect(component.listing).toBeDefined();
          expect(component.success).toBe(true);
      });

    it('should dispatch proper action', () => {
        component.create();

        expect(storeSpy).toHaveBeenCalledTimes(1);

        const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;

        expect(createListingAction.type).toEqual(HearingPartActionTypes.CreateListingRequest);
    });

    it('should prepare listing request with id', () => {
        component.create();

        expect(storeSpy).toHaveBeenCalledTimes(1);

        const createListingAction = storeSpy.calls.argsFor(0)[0] as CreateListingRequest;
        const createdListing = createListingAction.payload;

        expect(createdListing.id).toBeDefined();
    });

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
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
            providers: [NoteListComponent],
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
              parentId: undefined,
              entity: 'e'
          } as Note;

          secondNote = {
              id: undefined,
              content: 'a',
              type: 't',
              parentId: undefined,
              entity: 'e'
          } as Note;
      })
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
            expect(createdListing.notes[0].parentId).toEqual(createdListing.id);
            expect(createdListing.notes[1].parentId).toEqual(createdListing.id);
        });

        it('with properly generated entity names', () => {
            expect(createdListing.notes[0].entity).toEqual('ListingRequest');
            expect(createdListing.notes[1].entity).toEqual('ListingRequest');
        });
    })
  });
});

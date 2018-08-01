import { Store, StoreModule } from '@ngrx/store';
import { ListingCreateComponent } from './listing-create.component';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import * as fromHearingParts from '../../reducers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NoteComponent } from '../../../notes/components/note/note.component';

let storeSpy: jasmine.Spy;
let component: ListingCreateComponent;
let store: Store<fromHearingParts.State>;
let fixture: ComponentFixture<ListingCreateComponent>;

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
            providers: [],
        });

        fixture = TestBed.createComponent(ListingCreateComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store);
        storeSpy = spyOn(store, 'dispatch');
    });

  describe('create', () => {
    it('should dispatch action', () => {
        fixture.detectChanges();

        component.create();

        expect(storeSpy).toHaveBeenCalledTimes(1);
    });
  });
});

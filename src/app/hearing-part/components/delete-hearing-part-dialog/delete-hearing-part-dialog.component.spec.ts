import { DeleteHearingPartDialogComponent } from './delete-hearing-part-dialog.component';
import { Store, StoreModule } from '@ngrx/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as fromHearingParts from '../../reducers';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';
import { Delete, HearingPartActionTypes } from '../../actions/hearing-part.action';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

let storeSpy: jasmine.Spy;
let component: DeleteHearingPartDialogComponent;
let store: Store<fromHearingParts.State>;
let fixture: ComponentFixture<DeleteHearingPartDialogComponent>;
const matDialogRefSpy = jasmine.createSpyObj('MatDialog', ['close']);

const ID = 'id';

describe('DeleteHearingPartDialogComponent', () => {
  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
      ],
      declarations: [
        DeleteHearingPartDialogComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: createHearingPartViewModel()},
      ]
    });

    fixture = TestBed.createComponent(DeleteHearingPartDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  describe('clicking Yes', () => {
    it('should dispatch Delete action', () => {
      component.onYesClick(createHearingPartViewModel());
      const deleteAction = storeSpy.calls.argsFor(0)[0] as Delete;

      expect(deleteAction.type).toEqual(HearingPartActionTypes.Delete);
      expect(deleteAction.payload).toEqual(ID);
    });
  });
});

function createHearingPartViewModel() {
  return {
    id: ID
  } as HearingPartViewModel
}

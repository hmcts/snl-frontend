import { Component, Inject } from '@angular/core';
import { DraggableDialog } from '../../../core/dialog/draggable-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { Delete } from '../../actions/hearing-part.action';

@Component({
  selector: 'app-delete-hearing-part-dialog',
  templateUrl: 'delete-hearing-part-dialog.component.html'
})
export class DeleteHearingPartDialogComponent extends DraggableDialog {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public hearingPart: HearingPartViewModel,
    private readonly store: Store<State>) {
    super(dialogRef);
  }

  onYesClick() {
    this.store.dispatch(new Delete(this.hearingPart.id));

    this.dialogRef.close();
  }
}

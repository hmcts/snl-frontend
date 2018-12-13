import { Component, Inject } from '@angular/core';
import { DraggableDialog } from '../../../core/dialog/draggable-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NoteViewmodel, sortNotesByLatestFirst } from '../../models/note.viewmodel';
import { isOfTypeOtherOrListing } from '../../models/note.model';
import { NoteType } from '../../models/note-type';

@Component({
    selector: 'app-notes-list-dialog',
    templateUrl: './notes-list-dialog.component.html',
    styleUrls: ['./notes-list-dialog.component.scss']
})
export class NotesListDialogComponent extends DraggableDialog {

    public noteViewModels: NoteViewmodel[] = [];
    public freeTextNoteViewModels: NoteViewmodel[] = [];
    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: NoteViewmodel[]) {
        super(dialogRef);

        this.data.forEach(this.disposeToProperArrays);

        this.freeTextNoteViewModels = sortNotesByLatestFirst(this.freeTextNoteViewModels);

        this.noteViewModels = this.putNotesInOrder();
    }

    protected disposeToProperArrays = (n: NoteViewmodel) => {
        if (isOfTypeOtherOrListing(n)) {
            this.freeTextNoteViewModels.push(n);
        } else {
            this.noteViewModels.push(n);
        }
    };

    protected putNotesInOrder = () => {
        let specReqNvm = this.noteViewModels.find(nvm => nvm.type === NoteType.SPECIAL_REQUIREMENTS);
        let facReqNvm = this.noteViewModels.find(nvm => nvm.type === NoteType.FACILITY_REQUIREMENTS);

        return [specReqNvm, facReqNvm].filter(nvm => nvm !== undefined);
    }

}

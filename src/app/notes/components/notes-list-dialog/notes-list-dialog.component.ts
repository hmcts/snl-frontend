import { Component, Inject } from '@angular/core';
import { DraggableDialog } from '../../../core/dialog/draggable-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NoteViewmodel } from '../../models/note.viewmodel';

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

        this.freeTextNoteViewModels = this.sortOtherNotes(this.freeTextNoteViewModels);

        this.noteViewModels = this.putNotesInOrder();
    }

    protected disposeToProperArrays = (n: NoteViewmodel) => {
        if (n.type === 'Other note') {
            this.freeTextNoteViewModels.push(n);
        } else {
            this.noteViewModels.push(n);
        }
    }

    protected putNotesInOrder = () => {
        let specReqNvm = this.noteViewModels.find(nvm => nvm.type === 'Special Requirements');
        let facReqNvm = this.noteViewModels.find(nvm => nvm.type === 'Facility Requirements');

        return [specReqNvm, facReqNvm].filter(nvm => nvm !== undefined);
    }

    protected sortOtherNotes = (notes: NoteViewmodel[]) => {
        return notes.sort((left, right) => {
            return right.createdAt.diff(left.createdAt);
        });
    }
}

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getNoteViewModel, NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { HearingAssignmentNotesConfiguration } from '../../models/hearing-assignment-notes-configuration.model';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';

export interface AssignHearingData {
    confirmed: boolean;
    startTime?: string;
    notes?: NoteViewmodel[];
}

@Component({
  selector: 'app-assign-hearing-dialog',
  templateUrl: './assign-hearing-dialog.component.html',
  styleUrls: ['./assign-hearing-dialog.component.scss']
})
export class AssignHearingDialogComponent implements OnInit {

  @ViewChild('hearingAssignmentNotes') noteList: NoteListComponent;

  formGroup: FormGroup;
  startTime: string;
  notes: NoteViewmodel[];

  private selectedHearingId: string;
  startTimeDisplayed: boolean;

  constructor(public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public notesConfig: HearingAssignmentNotesConfiguration,
              public notesPreparerService: NotesPreparerService) {
    this.selectedHearingId = data.hearingId;
    this.startTimeDisplayed = data.startTimeDisplayed;
    this.startTime = (data.startTime && data.startTimeDisplayed) ? data.startTime.format('HH:mm') : undefined
  }

  ngOnInit() {
    this.initiateForm();
    this.initiateNotes();
  }

  onListHearing() {
    this.dialogRef.close({
        confirmed: true,
        startTime: this.startTime,
        notes: this.prepareNotes()
    } as AssignHearingData);
  }

  onCancel() {
    this.dialogRef.close({
        confirmed: false
    } as AssignHearingData);
  }

  private initiateForm() {
      if (this.startTimeDisplayed) {
          this.formGroup = new FormGroup({
              startTime: new FormControl(this.startTime, [Validators.required]),
          });
      }
  }

  private initiateNotes() {
      this.notes = this.notesConfig.defaultNotes()
          .map(getNoteViewModel)
  }

  private prepareNotes() {
      let notes = this.notesPreparerService.prepare(
          this.noteList.getModifiedNotes(),
          this.selectedHearingId,
          this.notesConfig.entityName
      );

      return this.notesPreparerService.removeEmptyNotes(notes);
  }
}

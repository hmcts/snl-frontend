import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionCreationSummary } from '../../models/session-creation-summary';

@Component({
  selector: 'app-sessions-create-dialog',
  templateUrl: './sessions-create-dialog.component.html',
  styleUrls: ['./sessions-create-dialog.component.scss']
})
export class SessionsCreateDialogComponent implements OnInit {

  constructor(
      public dialogRef: MatDialogRef<SessionsCreateDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SessionCreationSummary) {
  }

    onCloseClick(): void {
        this.dialogRef.close();
    }

  ngOnInit() {
  }

}

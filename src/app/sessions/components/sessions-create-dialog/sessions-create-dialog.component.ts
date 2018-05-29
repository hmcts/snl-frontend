import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionCreationSummary } from '../../models/session-creation-summary';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-sessions-create-dialog',
  templateUrl: './sessions-create-dialog.component.html',
  styleUrls: ['./sessions-create-dialog.component.scss']
})
export class SessionsCreateDialogComponent implements OnInit {

  dataLoading$: Observable<boolean>;
  buttonText$: Observable<string>;

  constructor(
      public dialogRef: MatDialogRef<SessionsCreateDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SessionCreationSummary) {
      this.dataLoading$ = combineLatest(this.data.sessionLoading, this.data.problemsLoading$, (sessions, problems) => {
          return sessions || problems;
      });
      this.buttonText$ = this.dataLoading$.map(loading => loading ? 'Leave' : 'Ok');
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

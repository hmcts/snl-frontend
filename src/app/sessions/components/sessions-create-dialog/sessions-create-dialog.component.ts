import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionCreationSummary } from '../../models/session-creation-summary';
import { Observable } from 'rxjs/Observable';
import { switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-sessions-create-dialog',
  templateUrl: './sessions-create-dialog.component.html',
  styleUrls: ['./sessions-create-dialog.component.scss']
})
export class SessionsCreateDialogComponent implements OnInit {

  dataLoading$: Observable<boolean>;
  sessionCreated$: Observable<boolean>;
  inProgress$: Observable<boolean>;
  buttonText$: Observable<string>;

  constructor(
      public dialogRef: MatDialogRef<SessionsCreateDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SessionCreationSummary) {
      this.data.problems$.subscribe(console.warn);
      this.sessionCreated$ = this.data.createdSessionStatus$.pipe(map(status => status.sessionCreated));
      this.inProgress$ = this.data.createdSessionStatus$.pipe(map(status => status.inProgress));
      this.buttonText$ = this.data.createdSessionStatus$.map(status => status.inProgress ? 'Hide the dialog' : 'Ok');
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

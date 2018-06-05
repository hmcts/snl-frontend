import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionCreationSummary } from '../../models/session-creation-summary';
import { Observable } from 'rxjs/Observable';
import { switchMap, map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'app-sessions-create-dialog',
  templateUrl: './sessions-create-dialog.component.html',
  styleUrls: ['./sessions-create-dialog.component.scss']
})
export class SessionsCreateDialogComponent implements OnInit {

  sessionCreated$: Observable<boolean>;
  problemsLoaded$: Observable<boolean>;
  finished$: Observable<boolean>;
  buttonText$: Observable<string>;

  constructor(
      public dialogRef: MatDialogRef<SessionsCreateDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SessionCreationSummary) {
      this.data.problems$.subscribe(console.warn);
      this.sessionCreated$ = this.data.createdSessionStatus$.pipe(map(status => status.sessionCreated), tap(console.log));
      this.problemsLoaded$ = this.data.createdSessionStatus$.pipe(map(status => status.problemsLoaded));
      this.finished$ = combineLatest(this.sessionCreated$, this.problemsLoaded$, (s, p) => { return s && p; });
      this.buttonText$ = this.finished$.pipe(map(finished => finished ? 'Ok' : 'Hide the dialog'));
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

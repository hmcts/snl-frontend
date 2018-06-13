import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionCreationSummary } from '../../models/session-creation-summary';
import { Observable } from 'rxjs/Observable';
import { switchMap, map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { CommitTransaction, RollbackTransaction } from '../../actions/session-transaction.action';

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

  transactionId: string;

  constructor(
      public dialogRef: MatDialogRef<SessionsCreateDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SessionCreationSummary,
      private store: Store<State>) {
      this.sessionCreated$ = this.data.createdSessionStatus$.pipe(map(status => status.sessionCreated));
      this.data.createdSessionStatus$.subscribe((status) => {this.transactionId = status.id});
      this.problemsLoaded$ = this.data.createdSessionStatus$.pipe(map(status => status.problemsLoaded));
      this.finished$ = combineLatest(this.sessionCreated$, this.problemsLoaded$, (s, p) => { return s && p; });
      this.buttonText$ = this.finished$.pipe(map(finished => finished ? 'Accept' : 'Hide the dialog'));
  }

  onOkClick(): void {
    this.dispatchAndClose(new CommitTransaction(this.transactionId));
  }

  onDeleteClick(): void {
    this.dispatchAndClose(new RollbackTransaction(this.transactionId));
  }

  private dispatchAndClose(action) {
      this.store.dispatch(action);
      this.dialogRef.close();
  }

  ngOnInit() {
  }

}

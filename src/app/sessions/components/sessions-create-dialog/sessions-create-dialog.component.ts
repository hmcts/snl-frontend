import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionCreationSummary } from '../../models/session-creation-summary';
import { Observable } from 'rxjs/Observable';
import { switchMap, map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Action, select, Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { CommitTransaction, RollbackTransaction } from '../../actions/session-transaction.action';
import * as fromSessionIndex from '../../reducers';
import { Problem } from '../../../problems/models/problem.model';
import { SessionTransaction } from '../../models/session-transaction-status.model';
import { Dictionary } from '@ngrx/entity/src/models';
import * as fromProblems from '../../../problems/reducers';

@Component({
  selector: 'app-sessions-create-dialog',
  templateUrl: './sessions-create-dialog.component.html',
  styleUrls: ['./sessions-create-dialog.component.scss']
})
export class SessionsCreateDialogComponent implements OnInit {

  transactedSessionProblems$: Observable<Problem[]>;
  transactedSessionStatus$: Observable<SessionTransaction>;
  sessionTransacted$: Observable<boolean>;
  problemsLoaded$: Observable<boolean>;
  finished$: Observable<boolean>;
  conflicted$: Observable<boolean>;
  buttonText$: Observable<string>;
  okAction: Action;

  transactionId: string;

  constructor(
      public dialogRef: MatDialogRef<SessionsCreateDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SessionCreationSummary,
      private store: Store<State>) {
      this.transactedSessionProblems$ = combineLatest(this.store.pipe(select(fromProblems.getProblems)),
          this.store.pipe(select(fromSessionIndex.getRecentlyCreatedSessionId)),
          (problems, id) => {return this.filterProblemsForSession(problems, id)});
      this.transactedSessionStatus$ = this.store.pipe(select(fromSessionIndex.getRecentlyCreatedSessionStatus));
      this.sessionTransacted$ = this.transactedSessionStatus$.pipe(map(status => status.completed));
      this.conflicted$ = this.transactedSessionStatus$.pipe(map(status => status.conflicted));
      this.conflicted$.subscribe(conflicted => this.okAction = conflicted ? null : new CommitTransaction(this.transactionId));
      this.problemsLoaded$ = this.transactedSessionStatus$.pipe(map(status => status.problemsLoaded));
      this.transactedSessionStatus$.subscribe((status) => {this.transactionId = status.id});
      this.finished$ = combineLatest(this.sessionTransacted$, this.problemsLoaded$, this.conflicted$,
          (s, p, c) => { return (s && p) || c; });
      this.buttonText$ = this.finished$.pipe(map(finished => finished ? 'Accept' : 'Hide the dialog'));
  }

  onOkClick(): void {
    this.dispatchAndClose(this.okAction);
  }

  onDeleteClick(): void {
    this.dispatchAndClose(new RollbackTransaction(this.transactionId));
  }

  private dispatchAndClose(action) {
      if(action !== null) {
          this.store.dispatch(action);
      }
      this.dialogRef.close();
  }

  private filterProblemsForSession(problems: Dictionary<Problem>, sessionId: string | String) {
    return Object.values(problems).filter(problem => {
        return problem.references ? problem.references.find(ref => {
            return ref ? ref.entity_id === sessionId : false
        }) : false
    })
  }

  ngOnInit() {
  }

}

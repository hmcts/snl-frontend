import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Action, select, Store } from '@ngrx/store';
import { State } from '../../../../app.state';
import { CommitTransaction, RollbackTransaction } from '../../actions/transaction.action';
import * as fromSessionIndex from '../../reducers';
import { Problem } from '../../../../problems/models/problem.model';
import { EntityTransaction } from '../../models/transaction-status.model';
import * as fromProblems from '../../../../problems/reducers';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent {
  problems$: Observable<Problem[]>;
  transactionStatus$: Observable<EntityTransaction>;
  transacted$: Observable<boolean>;
  problemsLoaded$: Observable<boolean>;
  finished$: Observable<boolean>;
  conflicted$: Observable<boolean>;
  okAction: Action;
  transactionId: string;

  constructor(
      private readonly dialogRef: MatDialogRef<TransactionDialogComponent>,
      private readonly store: Store<State>) {
      this.problems$ = this.store.pipe(select(fromProblems.getProblemsEntities), map(problems => problems ? Object.values(problems) : []));
      this.transactionStatus$ = this.store.pipe(select(fromSessionIndex.getRecentTransactionStatus));
      this.transacted$ = this.transactionStatus$.pipe(map(status => status.completed));
      this.conflicted$ = this.transactionStatus$.pipe(map(status => status.conflicted));
      this.conflicted$.subscribe(conflicted => this.okAction = conflicted ? null : new CommitTransaction(this.transactionId));
      this.problemsLoaded$ = this.transactionStatus$.pipe(map(status => status.problemsLoaded));
      this.transactionStatus$.subscribe((status) => {this.transactionId = status.id});
      this.finished$ = combineLatest(this.transacted$, this.problemsLoaded$, this.conflicted$,
          (s, p, c) => { return (s && p) || c; });
  }

  onOkClick(): void {
    if (this.okAction !== null) {
        this.store.dispatch(this.okAction);
    }
    this.dialogRef.close(true);
  }

  onHideDialogClick(): void {
    this.dialogRef.close(false);
  }

  onDeleteClick(): void {
    this.store.dispatch(new RollbackTransaction(this.transactionId));
    this.dialogRef.close(false);
  }
}

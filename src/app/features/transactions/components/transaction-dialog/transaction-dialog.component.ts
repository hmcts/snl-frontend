import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Action, select, Store, ActionsSubject } from '@ngrx/store';
import { State } from '../../../../app.state';
import {
    CommitTransaction,
    RollbackTransaction,
    EntityTransactionActionTypes
} from '../../actions/transaction.action';
import * as fromSessionIndex from '../../reducers';
import { Problem } from '../../../../problems/models/problem.model';
import { EntityTransaction } from '../../models/transaction-status.model';
import * as fromProblems from '../../../../problems/reducers';
import { ITransactionDialogData } from '../../models/transaction-dialog-data.model';
import { DialogInfoComponent } from '../../../notification/components/dialog-info/dialog-info.component';
import { DEFAULT_DIALOG_CONFIG } from '../../models/default-dialog-confg';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnDestroy {
  problems$: Observable<Problem[]>;
  transactionStatus$: Observable<EntityTransaction>;
  transacted$: Observable<boolean>;
  problemsLoaded$: Observable<boolean>;
  finished$: Observable<boolean>;
  conflicted$: Observable<boolean>;
  okAction: Action;
  transactionId: string;
  actionTitle: string;
  success: boolean;
  alive: boolean;

  constructor(
      private notificationDialog: MatDialog,
      private readonly dialogRef: MatDialogRef<TransactionDialogComponent>,
      public actionListener$: ActionsSubject,
      @Inject(MAT_DIALOG_DATA) public data: ITransactionDialogData,
      private readonly store: Store<State>) {

      this.alive = true;
      dialogRef.disableClose = true
      this.problems$ = this.store.pipe(select(fromProblems.getProblemsEntities), map(problems => problems ? Object.values(problems) : []));
      this.transactionStatus$ = this.store.pipe(select(fromSessionIndex.getRecentTransactionStatus));
      this.transacted$ = this.transactionStatus$.pipe(map(status => status.completed));
      this.conflicted$ = this.transactionStatus$.pipe(map(status => status.conflicted));
      this.conflicted$.subscribe(conflicted => this.okAction = conflicted ? null : new CommitTransaction(this.transactionId));
      this.problemsLoaded$ = this.transactionStatus$.pipe(map(status => status.problemsLoaded));
      this.transactionStatus$.subscribe((status) => {this.transactionId = status.id});
      this.finished$ = combineLatest(this.transacted$, this.problemsLoaded$, this.conflicted$,
          (s, p, c) => { return (s && p) || c; });
      combineLatest(this.transacted$, this.problemsLoaded$, this.conflicted$,
          (s, p, c) => { return (s && p && !c) }).subscribe(s => { this.success = s});
      this.actionTitle = data.actionTitle;

      this.actionListener$.pipe(takeWhile(() => this.alive)).subscribe(actions => {
          switch (actions.type) {
              case EntityTransactionActionTypes.TransactionCommitted: {
                  this.dialogRef.close(this.success);
                  break;
              }
              case EntityTransactionActionTypes.TransactionRolledBack: {
                  this.dialogRef.close(false);
                  break;
              }
              case EntityTransactionActionTypes.TransactionCommitFailed:
              case EntityTransactionActionTypes.TransactionRollbackFailed: {
                  this.dialogRef.close(false);
                  this.notificationDialog.open(DialogInfoComponent, {
                      ...DEFAULT_DIALOG_CONFIG,
                      data: 'Sorry, you have exceeded the time allowed to respond to this request. ' +
                          'If you still wish to make this change please try again'
                  });
                  break;
              }
          }
      });
  }

  onOkClick(): void {
    if (this.okAction !== null && this.success) {
        this.store.dispatch(this.okAction);
    } else {
        this.dialogRef.close(false);
    }
  }

  onHideDialogClick(): void {
    this.dialogRef.close(false);
  }

  onDeleteClick(): void {
    this.store.dispatch(new RollbackTransaction(this.transactionId));
  }

  ngOnDestroy(): void {
     this.alive = false;
  }
}

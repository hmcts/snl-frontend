import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import * as fromHearingParts from '../../../../hearing-part/reducers/index';
import * as fromProblems from '../../../../problems/reducers/index';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as sessionReducers from '../../../../sessions/reducers/index';
import * as fromTransactions from '../../reducers/index';
import { TransactionDialogComponent } from './transaction-dialog.component';
import * as problemActions from '../../../../problems/actions/problem.action';
import { Problem } from '../../../../problems/models/problem.model';
import * as sessionTransactionActions from '../../actions/transaction.action';
import { EntityTransaction } from '../../models/transaction-status.model';
import { CommitTransaction, RollbackTransaction } from '../../actions/transaction.action';

let store: Store<fromHearingParts.State>;
let component: TransactionDialogComponent;
let storeSpy: jasmine.Spy;
const matDialogRefSpy = jasmine.createSpyObj('MatDialog', ['close']);
const notificationMatDialogSpy = jasmine.createSpyObj('MatDialog', ['close']);
const isEntityTransactionCompleted = false;
const isEntityTransactionConflicted = false;
const areProblemsLoaded = false;
const transactionId = 'some-id';
const mockedProblems: Problem[] = [
  {
    id: 'some-problem-id',
    message: 'some-msg',
    severity: 'some-severity',
    type: 'some-type',
    references: undefined,
    createdAt: undefined
  }
];
const mockEntityTransaction: EntityTransaction = {
  entityId: 'some-transaction-entityId',
  id: transactionId,
  problemsLoaded: areProblemsLoaded,
  completed: isEntityTransactionCompleted,
  conflicted: isEntityTransactionConflicted
};

describe('TransactionDialogComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('problems', fromProblems.reducers),
        StoreModule.forFeature('sessions', sessionReducers.reducers),
        StoreModule.forFeature('transactions', fromTransactions.reducers)
      ],
      providers: [
        TransactionDialogComponent,
        { provide: MatDialog, useValue: notificationMatDialogSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    });

    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(
      new sessionTransactionActions.InitializeTransaction(mockEntityTransaction)
    );
    component = TestBed.get(TransactionDialogComponent);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(component).toBeDefined();
    });
    it('should fetch problems', () => {
      store.dispatch(new problemActions.GetComplete(mockedProblems));
      component.problems$.subscribe(problems => {
        expect(problems).toEqual(mockedProblems);
      });
    });
    it('should set transacted', () => {
      component.transacted$.subscribe(isTransacted => {
        expect(isTransacted).toEqual(isEntityTransactionCompleted);
      });
    });
    it('should set conflicted', () => {
      component.conflicted$.subscribe(isConflicted => {
        expect(isConflicted).toEqual(isEntityTransactionConflicted);
      });
    });
    it('should set okAction', () => {
      expect(component.okAction instanceof CommitTransaction).toBeTruthy();
    });
    it('should set problemsLoaded', () => {
      component.problemsLoaded$.subscribe(problemsLoaded => {
        expect(problemsLoaded).toEqual(areProblemsLoaded);
      });
    });
    it('should set transactionId', () => {
      expect(component.transactionId).toEqual(transactionId)
    });
    it('should set finished', () => {
      component.finished$.subscribe(finished => {
        expect(finished).toEqual(false);
      });
    });
  });

  describe('onOkClick', () => {
    beforeEach(() => storeSpy.calls.reset())
    it('should dispatch action when succeed and okAction is not null', () => {
      component.okAction = new CommitTransaction(transactionId)
      component.success = true
      component.onOkClick()
      expect(storeSpy).toHaveBeenCalled()
    });

    it('should not dispatch action when okAction is null', () => {
      component.okAction = null
      component.onOkClick()
      expect(storeSpy).not.toHaveBeenCalled()
    });

    it('should not dispatch action when no success', () => {
      component.success = false
      component.onOkClick()
      expect(storeSpy).not.toHaveBeenCalled()
    });
  });

  describe('onDeleteClick', () => {
    beforeEach(() => storeSpy.calls.reset())
    it('should dispatch RollbackTransaction action with transactionId', () => {
      component.onDeleteClick()
      const action = storeSpy.calls.first().args[0];
      expect(action instanceof RollbackTransaction).toBeTruthy();
    });
  });
});

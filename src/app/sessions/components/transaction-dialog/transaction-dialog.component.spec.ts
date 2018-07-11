import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import * as fromHearingParts from '../../../hearing-part/reducers/index';
import * as fromProblems from '../../../problems/reducers';
import { MatDialogRef } from '@angular/material';
import * as sessionReducers from './../../reducers/index';
import { TransactionDialogComponent } from './transaction-dialog.component';
import * as problemActions from '../../../problems/actions/problem.action';
import { Problem } from '../../../problems/models/problem.model';
import * as sessionTransactionActions from '../../actions/transaction.action';
import { EntityTransaction } from '../../models/transaction-status.model';
import { CommitTransaction, RollbackTransaction } from '../../actions/transaction.action';

let store: Store<fromHearingParts.State>;
let component: TransactionDialogComponent;
let storeSpy: jasmine.Spy;
const matDialogRefSpy = jasmine.createSpyObj('MatDialog', ['close']);
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
    references: undefined
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
        StoreModule.forFeature('sessions', sessionReducers.reducers)
      ],
      providers: [
        TransactionDialogComponent,
        { provide: MatDialogRef, useValue: matDialogRefSpy }
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
    it('should set buttonText', () => {
      component.buttonText$.subscribe(buttonText => {
        expect(buttonText).toEqual('Hide the dialog');
      });
    });
  });

  describe('onOkClick', () => {
    beforeEach(() => storeSpy.calls.reset())
    it('should dispatch action when okAction is not null', () => {
      component.okAction = new CommitTransaction(transactionId);
      component.onOkClick()
      expect(storeSpy).toHaveBeenCalled()
    });

    it('should not dispatch action when okAction is null', () => {
      component.okAction = null;
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

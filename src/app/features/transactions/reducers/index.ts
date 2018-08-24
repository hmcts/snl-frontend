import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTransactions from './transaction.reducer';
import * as fromRoot from '../../../app.state';

export interface TransactionsState {
    readonly transactions: fromTransactions.State;
}

export interface State extends fromRoot.State {
    transactions: TransactionsState;
}

export const reducers: ActionReducerMap<TransactionsState> = {
    transactions: fromTransactions.reducer,
};

export const getTransactionsState = createFeatureSelector<TransactionsState>('transactions');
export const getTransactionsEntitiesState = createSelector(
    getTransactionsState,
    state => state.transactions
);

export const getTransactionsEntities = createSelector(
    getTransactionsEntitiesState,
    state => state.entities
);

export const getRecentTransactionId = createSelector(
    getTransactionsEntitiesState,
    fromTransactions.getRecent,
);

export const getRecentTransactionStatus = createSelector(
    getTransactionsEntities,
    getRecentTransactionId,
    (transactionEntities, recentlyCreatedTransactionId) => {
        return transactionEntities[recentlyCreatedTransactionId];
    }
);

export const {
    selectIds: getSessionIds,
    selectEntities: getSessionEntities,
    selectAll: getAllSessions,
    selectTotal: getTotalSessions,
} = fromTransactions.adapter.getSelectors(getTransactionsEntitiesState);

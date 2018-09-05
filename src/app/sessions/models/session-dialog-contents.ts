import { TransactionStatuses } from '../../features/transactions/services/transaction-backend.service';

export const SESSION_MODIFY_CONFLICT = 'The session cannot be assigned because one of the engaged' +
    ' entities is already being modified by someone else. Please try again later';

export const SESSION_DIALOGS = {
    [TransactionStatuses.CONFLICT]: SESSION_MODIFY_CONFLICT
}

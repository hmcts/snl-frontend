import { TransactionStatuses } from '../../core/services/transaction-backend.service';

export const HEARING_PART_ASSIGN_CONFLICT = 'The hearing part cannot be assigned because one of the engaged' +
    ' entities is already being modified by someone else. Please try again later';

export const HEARING_PART_DIALOGS = {
    [TransactionStatuses.CONFLICT]: HEARING_PART_ASSIGN_CONFLICT,
    ['OK']: 'OK, OK'
}

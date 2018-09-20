import { Observable } from 'rxjs';

export interface ITransactionDialogData {
    actionTitle?: string,
    summaryMsg$?: Observable<string>
}

import { Hearing } from './hearing';
import { Observable } from 'rxjs';

export interface PossibleActionConfig {
    enabled: boolean,
    openDialog: () => Observable<any>,
    callService: (hearing: Hearing, description: string) => void,
    summaryText: string
}

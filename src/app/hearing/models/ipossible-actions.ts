import { HearingActions } from './hearing-actions';
import { PossibleActionConfig } from './possible-action-config';

export interface IPossibleActionConfigs {
    [HearingActions.Unlist]: PossibleActionConfig;
    [HearingActions.Adjourn]: PossibleActionConfig;
    [HearingActions.Withdraw]: PossibleActionConfig;
}

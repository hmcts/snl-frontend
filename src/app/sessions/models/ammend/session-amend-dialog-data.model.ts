import { SessionType } from '../../../core/reference/models/session-type';
import { SessionAmendForm } from '../../../../../e2e/models/session-amend-form';

export interface SessionAmmendDialogData {
    sessionData: SessionAmendForm,
    sessionTypes: SessionType[],
}

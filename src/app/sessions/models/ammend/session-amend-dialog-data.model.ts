import { Session } from '../session.model';
import { SessionType } from '../../../core/reference/models/session-type';

export interface SessionAmmendDialogData {
    sessionData: Session,
    sessionTypes: SessionType[]
}

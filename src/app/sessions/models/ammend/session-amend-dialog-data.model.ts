import { SessionType } from '../../../core/reference/models/session-type';
import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import { SessionViewModel } from '../session.viewmodel';

export interface SessionAmmendDialogData {
    sessionData: SessionViewModel,
    sessionTypes: SessionType[],
    rooms: Room[],
    judges: Judge[],
}

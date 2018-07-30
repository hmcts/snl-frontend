import { SessionCreate } from './session-create.model';
import { Observable } from 'rxjs';
import { Room } from '../../rooms/models/room.model';
import { Judge } from '../../judges/models/judge.model';

export interface DialogCreateSessionData {
    onCreateSessionAction: (SessionCreate) => void;
    onCancelAction: (event) => void;
    sessionData: SessionCreate;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
}

import { SessionCreate } from './session-create.model';
import { Observable } from 'rxjs/Observable';
import { Room } from '../../rooms/models/room.model';
import { Judge } from '../../judges/models/judge.model';
import { CaseType } from '../../core/reference/models/case-type';
import { SessionType } from '../../core/reference/models/session-type';

export interface DialogCreateSessionData {
    onCreateSessionAction: (SessionCreate) => void;
    onCancelAction: (event) => void;
    sessionData: SessionCreate;
    rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    caseTypes$: Observable<CaseType[]>;
    sessionTypes$: Observable<SessionType[]>;
}

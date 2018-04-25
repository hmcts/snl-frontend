
import { Session } from './sessions/models/session.model';
import { Judge } from './judges/models/judge.model';
import { Room } from './rooms/models/room.model';

export interface AppState {
  readonly sessionsReducer: {
    readonly sessions: Session[];
    readonly loading: boolean;
    readonly error: string;
  };
  readonly staticDataReducer: {
    readonly caseTypes: string;
    readonly judges: Judge[];
    readonly rooms: Room[];
  };
}

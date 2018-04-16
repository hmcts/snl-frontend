
import { Session } from './sessions/models/session.model';

export interface AppState {
  readonly sessionsReducer: {
    readonly sessions: Session[];
    readonly loading: boolean;
    readonly error: string;
  }
}

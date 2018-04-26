import { Room } from '../../rooms/models/room.model';
import { Judge } from '../../judges/models/judge.model';

export interface Session {
  start: Date;
  duration: String;
  room: Room;
  judgeId: String;
  jurisdiction: String;
}

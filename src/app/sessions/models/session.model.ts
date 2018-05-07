import { Room } from '../../rooms/models/room.model';
import { Judge } from '../../judges/models/judge.model';

export interface Session {
  start: Date;
  duration: number;
  room: Room;
  person: Judge;
  caseType: string;
  jurisdiction: string;
}

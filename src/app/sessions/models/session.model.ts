import {Room} from "../../rooms/models/room.model";
import {Judge} from "../../judges/models/judge.model";

export interface Session {
  date: Date;
  durationInMinutes: Number;
  room: Room;
  judge: Judge;
  jurisdiction: String;
}

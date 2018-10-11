import * as moment from 'moment';
import { Priority } from '../../hearing-part/models/priority-model';

export interface Note {
  content: string,
  createdAt: moment.Moment,
  modifiedBy: string
}

export interface Session {
  start: moment.Moment,
  duration: number,
  room: string,
  judge: string,
  type: string,
  notes: Note[]
}

export interface Hearing {
  id: string,
  caseNumber: string,
  caseTitle: string,
  caseType: string,
  hearingType: string,
  duration: number,
  scheduleStart: moment.Moment,
  scheduleEnd: moment.Moment,
  priority: Priority,
  communicationFacilitator: string,
  specialRequirements: string,
  facilityRequirements: string,
  reservedToJudge: string,
  notes: Note[],
  sessions: Session[]
}

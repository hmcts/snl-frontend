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
  sessionType: string,
  notes: Note[]
}

export interface Hearing {
  id: string,
  caseNumber: string,
  caseTitle: string,
  caseType: string,
  hearingType: string,
  duration: number,
  scheduleStart: string,
  scheduleEnd: string,
  priority: Priority,
  communicationFacilitator: string,
  specialRequirements: string,
  facilityRequirements: string,
  reservedToJudge: string,
  notes: Note[],
  sessions: Session[],
  version: string
}

export interface UnlistHearingRequest {
  hearingId: string,
  hearingVersion: string,
  userTransactionId: string
}

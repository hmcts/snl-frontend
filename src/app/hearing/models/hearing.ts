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
  numberOfSessions: number,
  multiSession: boolean
  version: string,
  hearingPartsVersions: VersionInfo[],
  status: string
}

export interface VersionInfo {
  id: string,
  version: string
}

export interface UpdateStatusHearingRequest {
  hearingId: string,
  hearingPartsVersions: VersionInfo[],
  userTransactionId: string
}

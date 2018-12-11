import * as moment from 'moment';
import { Priority } from '../../hearing-part/models/priority-model';
import { HearingActions } from './hearing-actions';

export interface Note {
  content: string,
  createdAt: moment.Moment,
  modifiedBy: string
}

export interface ScheduledListing {
  hearingPartStartTime: moment.Moment,
  start: moment.Moment,
  duration: number,
  roomName: string,
  judgeName: string,
  sessionType: string,
  hearingPartIdOfCurrentHearing: string,
  hearingPartVersionOfCurrentHearing: number,
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
  sessions: ScheduledListing[],
  numberOfSessions: number,
  multiSession: boolean
  version: number,
  hearingPartsVersions: VersionInfo[],
  status: string,
  possibleActions: PossibleActions
}

export interface PossibleActions {
    [HearingActions.Unlist]: boolean,
    [HearingActions.Adjourn]: boolean,
    [HearingActions.Withdraw]: boolean,
}

export interface VersionInfo {
  id: string,
  version: string
}

export interface UnlistHearingRequest {
  hearingId: string,
  hearingPartsVersions: VersionInfo[],
  userTransactionId: string
}

export interface AdjournHearingRequest {
    hearingId: string,
    hearingVersion: number,
    userTransactionId: string
}

export interface WithdrawHearingRequest extends AdjournHearingRequest { }
export interface VacateHearingRequest extends AdjournHearingRequest { }

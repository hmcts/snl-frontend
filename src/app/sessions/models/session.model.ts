import * as moment from 'moment'
export interface Session {
  id: string,
  start: moment.Moment;
  duration: number;
  room: string;
  person: string;
  caseType: string;
  hearingTypes: string[];
  jurisdiction: string;
  version: number;
}

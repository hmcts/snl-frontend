import { CaseTypes } from '../enums/case-types';
import { HearingTypes } from '../enums/hearing-types';

export interface ListingCreationForm {
  caseNumber: string;
  caseTitle: string;
  caseType: CaseTypes;
  hearingType: HearingTypes;
  durationMinutes: number;
  durationDays: number;
  numberOfSessions: number;
  fromDate: string;
  endDate: string;
  multiSession: boolean;
}

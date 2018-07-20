import { CaseTypes } from '../enums/case-types';
import { HearingParts } from '../enums/hearing-parts';

export interface ListingCreationForm {
  caseNumber: string;
  caseTitle: string;
  caseType: CaseTypes;
  hearingType: HearingParts;
  duration: number;
  fromDate: string;
  endDate: string;
}

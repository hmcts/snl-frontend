import { ListingCreationForm } from '../listing-creation-form';
import * as moment from 'moment';
import { HearingParts } from '../../enums/hearing-parts';
import { CaseTypes } from '../../enums/case-types';

const now = moment()
export const caseNumber = now.format('HH:mm DD.MM')
const todayDate = now.format('DD/MM/YYYY')
const tomorrowDate = now.add(1, 'day').format('DD/MM/YYYY')
const duration = 15
const caseTitle = 'e2e Test'
const listingRequestCaseType = CaseTypes.MTRACK // must be other than sessionCaseType
const hearingType = HearingParts.ADJOURNED

export const listingCreationForm: ListingCreationForm = {
  caseNumber,
  caseTitle,
  caseType: listingRequestCaseType,
  hearingType: hearingType,
  duration: duration,
  fromDate: todayDate,
  endDate: tomorrowDate
}
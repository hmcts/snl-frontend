import { CaseTypes } from '../enums/case-types';
import { Rooms } from '../enums/rooms';
import { Judges } from '../enums/judges';
import { ListingDetailsOptions } from './listing-details-options';

export interface FilterSessionsComponentForm {
    startDate: string,
    endDate: string,
    caseType: CaseTypes,
    room: Rooms,
    judge: Judges,
    listingDetailsOptions: ListingDetailsOptions
}

import { Rooms } from '../enums/rooms';
import { Judges } from '../enums/judges';
import { ListingDetailsOptions } from './listing-details-options';
import { SessionTypes } from '../enums/session-types';

export interface FilterSessionsComponentForm {
    startDate: string;
    endDate: string;
    sessionType: SessionTypes;
    room: Rooms;
    judge: Judges;
    listingDetailsOptions: ListingDetailsOptions;
}

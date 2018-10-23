import { ListingStatus } from './listing-status-model';

export interface HearingsFilters {
    caseNumber: string,
    caseTitle: string,
    priorities: string[],
    caseTypes: string[],
    hearingTypes: string[],
    communicationFacilitators: string[],
    judges: string[],
    listingStatus: ListingStatus
}

export const DEFAULT_HEARING_FILTERS: HearingsFilters = {
    caseNumber: '',
    caseTitle: '',
    priorities: [],
    caseTypes: [],
    hearingTypes: [],
    communicationFacilitators: [],
    judges: [],
    listingStatus: ListingStatus.All
}

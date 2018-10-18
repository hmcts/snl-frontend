
export interface HearingsFilters {
    caseNumber: string,
    caseTitle: string,
    priorities: string[],
    caseTypes: string[],
    hearingTypes: string[],
    communicationFacilitators: string[],
    judges: string[],
    listingDetails: string
}

export const DEFAULT_HEARING_FILTERS: HearingsFilters = {
    caseNumber: '',
    caseTitle: '',
    priorities: [],
    caseTypes: [],
    hearingTypes: [],
    communicationFacilitators: [],
    judges: [],
    listingDetails: 'all'
}

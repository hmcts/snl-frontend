import { DEFAULT_SEARCH_CRITERIA, SearchCriteria } from './search-criteria';

export interface SearchHearingRequest {
    httpParams?: any;
    searchCriteria?: SearchCriteria[]
}

export const DEFAULT_SEARCH_HEARING_REQUEST: SearchHearingRequest = {
    searchCriteria: [DEFAULT_SEARCH_CRITERIA]
}

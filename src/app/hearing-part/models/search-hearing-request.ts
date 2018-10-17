import { SearchCriteria } from './search-criteria';

export interface SearchHearingRequest {
    httpParams?: any;
    searchCriteria?: SearchCriteria[]
}
export interface SearchCriteria {
    key: string;
    operation: string;
    value: any;
}

export const DEFAULT_SEARCH_CRITERIA: SearchCriteria = {
    key: '',
    operation: '',
    value: '',
}

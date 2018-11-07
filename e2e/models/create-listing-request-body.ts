export interface CreateListingRequestBody {
    id: string;
    caseNumber: string;
    caseTitle: string;
    caseTypeCode: string;
    hearingTypeCode: string;
    duration: string;
    priority: string;
    userTransactionId: string;
    numberOfSessions: number;
    isMultiSession: boolean;
}

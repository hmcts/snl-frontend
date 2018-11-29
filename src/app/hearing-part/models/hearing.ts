export interface Hearing {
    id: string;
    caseNumber: string;
    caseTitle: string;
    caseTypeCode: string;
    hearingTypeCode: string;
    duration: string;
    scheduleStart: string;
    scheduleEnd: string;
    priority: string;
    reservedJudgeId: string;
    communicationFacilitator: string;
    deleted: boolean;
    version: number;
    numberOfSessions: number;
    multiSession: boolean;
    status: string;
}

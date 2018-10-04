export interface HearingPartResponse {
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
    sessionId?: string;
    version: number;
}

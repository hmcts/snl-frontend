export interface SessionAmendResponse {
    id: string;
    start: string;
    duration: string;
    sessionTypeCode: string;
    personName: string;
    roomName: string;
    roomDescription: string;
    roomTypeCode: string;
    hearingPartsCount: number;
    hasMultiSessionHearingAssigned: boolean;
    version: number;
}

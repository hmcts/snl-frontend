export interface SessionSearchResponse {
    sessionId: string;
    personId: string;
    personName: string;
    roomId: string;
    roomName: string;
    sessionTypeCode: string;
    sessionTypeDescription: string;
    // OffsetDateTime
    startDate: string;
    startTime: string;
    // Duration
    duration: string;
    noOfHearingPartsAssignedToSession: number;
    allocatedDuration: number;
    utilisation: number;
    // Duration
    available: string;
    hasMultiSessionHearingAssigned: boolean;
    sessionVersion: number;
}

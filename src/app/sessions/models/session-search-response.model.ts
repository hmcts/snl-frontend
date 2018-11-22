export interface SessionSearchResponse {
    sessionId: string;
    personName: string;
    roomName: string;
    sessionTypeDescription: string;
    // OffsetDateTime
    startDate: string;
    startTime: string;
    // Duration
    duration: string;
    noOfHearingPartsAssignedToSession: number;
    // Duration
    allocatedDuration: string;
    utilisation: number;
    // Duration
    available: string;
}

export interface SessionsAssignment {
    sessionsData: SessionAssignmentData[],
    userTransactionId: string,
    start: Date
}

export interface HearingToSessionAssignment extends SessionsAssignment {
    hearingId: string,
    hearingVersion: number,
}

export interface HearingPartToSessionAssignment extends SessionsAssignment {
    hearingPartId: string,
    hearingPartVersion: number,
}

export interface SessionAssignmentData {
    sessionId: string,
    sessionVersion: number
}
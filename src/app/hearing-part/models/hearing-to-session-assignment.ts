export interface SessionsAssignment {
    userTransactionId: string,
    start: Date
}

export interface HearingToSessionAssignment extends SessionsAssignment {
    hearingId: string,
    hearingVersion: number,
    sessionsData: SessionAssignmentData[]
}

export interface HearingPartToSessionAssignment extends SessionsAssignment {
    hearingPartId: string,
    hearingPartVersion: number,
    sessionData: SessionAssignmentData
}

export interface SessionAssignmentData {
    sessionId: string,
    sessionVersion: number
}
export interface SessionAssignment {
    sessionId: string,
    sessionVersion: number,
    userTransactionId: string,
    start: Date
}

export interface HearingToSessionAssignment extends SessionAssignment {
    hearingId: string,
    hearingVersion: number,
}

export interface HearingPartToSessionAssignment extends SessionAssignment {
    hearingPartId: string,
    hearingPartVersion: number,
}
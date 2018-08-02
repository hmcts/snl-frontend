
export interface SessionAssignment {
    sessionId: string,
    sessionVersion: number,
    userTransactionId: string,
    hearingPartId: string,
    hearingPartVersion: number,
    start: Date
}

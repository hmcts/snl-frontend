
export interface SessionAmmend {
    id: string,
    userTransactionId: string,
    durationInSeconds: number,
    startTime: string, // ie "12:30", "08:45"
    sessionTypeCode: string,
    version: number
}

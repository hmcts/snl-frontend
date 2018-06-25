
export interface SessionCreate {
    id: String;
    userTransactionId: String,
    personId: String;
    roomId: String;
    duration: number;
    start: Date;
    caseType: String
}


export interface SessionCreate {
    id: String;
    userTransactionId: String,
    personId: String;
    roomId: String;
    duration: Number;
    start: Date;
    caseType: String
}


export interface SessionCreate {
    id: string;
    userTransactionId: string,
    personId: string;
    roomId: string;
    duration: number;
    start: Date;
    caseType: string
}

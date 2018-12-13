export interface DragAndDropSessionRequest {
    sessionId: string;
    start: Date;
    durationInSeconds: number;
    roomId: string;
    personId: string;
    version: number;
    userTransactionId: string;
}

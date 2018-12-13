export interface DragAndDropSession {
    sessionId: string;
    start: Date;
    durationInSeconds: number;
    roomId: string;
    personId: string;
    version: number;
}

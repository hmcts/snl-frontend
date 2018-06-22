export interface SessionPropositionQuery {
    from: Date;
    to: Date;
    durationInMinutes: number;
    roomId: string;
    judgeId: string;
}

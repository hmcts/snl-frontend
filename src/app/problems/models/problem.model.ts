export interface Problem {
    id: string;
    message: string;
    severity: string;
    type: string;
    references: [string];
}

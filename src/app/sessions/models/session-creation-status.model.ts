export interface SessionCreationStatus {
  sessionId: string,
  transactionId: string,
  status: string,
  problemsLoaded: boolean,
  sessionCreated: boolean,
}

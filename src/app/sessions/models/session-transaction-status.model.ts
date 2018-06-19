export interface SessionTransaction {
  entityId: string,
  id: string,
  status: string,
  problemsLoaded: boolean,
  completed: boolean,
  conflicted: boolean
}

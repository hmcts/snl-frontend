export interface EntityTransaction {
  entityId: string,
  id: string,
  problemsLoaded: boolean,
  completed: boolean,
  conflicted: boolean
}

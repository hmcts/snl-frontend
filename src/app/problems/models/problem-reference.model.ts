export interface ProblemReference {
    id: string;
    entity: string;
    entity_id: string;
    problem_id: string;
    description: string; // TODO this can contain case type or hearing type, but it is precompiled in snl-rules as such can't do it here
    // OR can we ??
}

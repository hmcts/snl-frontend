import { Schema, schema } from 'normalizr';

export const person = new schema.Entity('persons');

export const room = new schema.Entity('rooms');

export const hearingPart = new schema.Entity('hearingParts', {});
export const hearingParts = new schema.Array(hearingPart);

export const session = new schema.Entity('sessions', {
    person: person,
    room: room,
    hearingParts: hearingParts
} as Schema);

hearingPart.define({session: session} as Schema);

export const sessions = new schema.Array(session);
export const sessionsWithHearings = new schema.Entity('sessionsWithHearings', {sessions, hearingParts}  as Schema);

export const problemReference = new schema.Entity('problemReferences');
export const problemReferences = new schema.Array(problemReference);

export const problem = new schema.Entity('problems', {
    references: problemReferences
} as Schema);

export const problems = new schema.Array(problem);

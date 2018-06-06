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

export const problem = new schema.Entity('problems', {
} as Schema);

export const problems = new schema.Array(problem);

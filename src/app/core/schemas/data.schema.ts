import { schema } from 'normalizr';
// Define a users schema
export const person = new schema.Entity('persons');

// Define your comments schema
export const room = new schema.Entity('rooms');

export const hearingPart = new schema.Entity('hearingParts', {
});

export const hearingParts = new schema.Array(hearingPart);

export const session = new schema.Entity('sessions', {
    person: person,
    room: room,
    hearingParts: hearingParts
});

hearingPart.define({session: session});

export const sessions = new schema.Array(session);
export const sessionsWithHearings = new schema.Entity('sessionsWithHearings', {sessions, hearingParts});

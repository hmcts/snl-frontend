import { schema } from 'normalizr';
// Define a users schema
export const person = new schema.Entity('persons');

// Define your comments schema
export const room = new schema.Entity('rooms');

export const session = new schema.Entity('sessions', {
    person: person,
    room: room,
});

export const sessions = new schema.Array(session);

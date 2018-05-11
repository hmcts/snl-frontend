import { schema } from 'normalizr';

export const room = new schema.Entity('rooms');

export const rooms = new schema.Array(room);
import { schema } from 'normalizr';
import { session } from '../../sessions/schemas/session.schema';

export const hearingPart = new schema.Entity('hearingParts', {
    session: session
});

export const hearingParts = new schema.Array(hearingPart);

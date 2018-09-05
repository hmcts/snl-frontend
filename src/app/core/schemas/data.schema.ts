import { Schema, schema } from 'normalizr';

export const person = new schema.Entity('persons');

export const room = new schema.Entity('rooms');

export const hearingPart = new schema.Entity('hearingParts', {});
export const hearingParts = new schema.Array(hearingPart);

export const session = new schema.Entity('sessions', {
    person,
    room,
    hearingParts
} as Schema);

hearingPart.define({session} as Schema);

export const sessions = new schema.Array(session);
export const sessionsWithHearings = new schema.Entity('sessionsWithHearings', {sessions, hearingParts}  as Schema);

export const problem = new schema.Entity('problems', {
} as Schema);

export const problems = new schema.Array(problem);

// might be needed with normalization of other entities
export const caseType = new schema.Entity('caseType', {}, { idAttribute: 'code' });
export const caseTypes = new schema.Array(caseType);

export const hearingType = new schema.Entity('hearingType', {}, { idAttribute: 'code' });
export const hearingTypes = new schema.Array(hearingType);

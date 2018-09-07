import { CreateSessionForm } from './../models/create-session-form.model';
import { SessionCreate } from '../models/session-create.model';
import { SessionCreateToCreateSessionForm, CreateSessionFormToSessionCreate } from './create-session-form-session-create';
import * as moment from 'moment';

const personId = 'some-person-id';
const roomId = 'some-room-id';
const caseType = 'some-case-type';
const sessionTypeCode = 'some-session-type-code';
const durationInSeconds = 1800
const durationInMinutes = durationInSeconds / 60
const now = moment()

describe('CreateSessionFormSessionCreate Mapper', () => {
    describe('SessionCreateToCreateSessionForm', () => {
        it('should map SessionCreate model into CreateSessionForm', () => {
            const sessionCreate: SessionCreate = {
                id: 'some-id',
                userTransactionId: 'some-user-transaction',
                personId,
                roomId,
                caseType,
                sessionTypeCode,
                duration: durationInSeconds,
                start: now
            }

            const expectedCreateSessionForm: CreateSessionForm = {
                personId,
                roomId,
                sessionTypeCode,
                startDate: now,
                startTime: now.format('HH:mm'),
                durationInMinutes
            }

            expect(SessionCreateToCreateSessionForm(sessionCreate)).toEqual(expectedCreateSessionForm)
        });
    });

    describe('CreateSessionFormToSessionCreate', () => {
        it('should map CreateSessionForm model into SessionCreate', () => {
            const createSessionForm: CreateSessionForm = {
                personId,
                roomId,
                sessionTypeCode,
                startDate: now,
                startTime: now.format('HH:mm'),
                durationInMinutes
            }

            const expectedSessionCreate: SessionCreate = {
                id: undefined,
                userTransactionId: undefined,
                personId,
                roomId,
                caseType: null,
                sessionTypeCode,
                duration: durationInSeconds,
                start: now
            }

            expect(CreateSessionFormToSessionCreate(createSessionForm)).toEqual(expectedSessionCreate)
        });
    });
});

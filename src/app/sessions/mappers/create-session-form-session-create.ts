import * as moment from 'moment';
import { SessionCreate } from '../models/session-create.model';
import { CreateSessionForm } from '../models/create-session-form.model';

export const SessionCreateToCreateSessionForm = (sessionCreate: SessionCreate): CreateSessionForm => {
    const {personId, roomId, caseType, sessionTypeCode, start} = sessionCreate
    const durationInMinutes = Math.floor(sessionCreate.duration / 60)
    const startTime = moment(sessionCreate.start).format('HH:mm');
    return {personId, roomId, caseType, sessionTypeCode, durationInMinutes, startDate: start, startTime}
}

export const CreateSessionFormToSessionCreate = (createSessionForm: CreateSessionForm): SessionCreate => {
    const {personId, roomId, caseType, sessionTypeCode} = createSessionForm
    const durationInSeconds = Math.floor(createSessionForm.durationInMinutes.valueOf() * 60)
    const startDateWithTime = createSessionForm.startDate
    const timeArr = createSessionForm.startTime.split(':');
    startDateWithTime.set('hours', +timeArr[0]);
    startDateWithTime.set('minutes', +timeArr[1]);

    return {
        personId,
        roomId,
        caseType,
        sessionTypeCode,
        duration: durationInSeconds,
        start: startDateWithTime,
        id: undefined,
        userTransactionId: undefined
    }
}

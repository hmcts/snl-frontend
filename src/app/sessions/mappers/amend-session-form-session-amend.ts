import * as moment from 'moment';
import { SessionAmmendForm } from '../models/ammend/session-ammend-form.model';
import { SessionAmmend } from '../models/ammend/session-ammend.model';
import { Session } from '../models/session.model';

export const SessionToAmendSessionForm = (session: Session): SessionAmmendForm => {
    const durationInMinutes = Math.floor(session.duration / 60)
    const startTime = moment(session.start).format('HH:mm');
    const startDate = session.start;
    const sessionTypeCode = session.sessionTypeCode;

    return {
        durationInMinutes: durationInMinutes,
        startTime: startTime,
        startDate: startDate,
        sessionTypeCode: sessionTypeCode
    } as SessionAmmendForm
}

export const AmendSessionFormToSessionAmend = (amendSessionForm: SessionAmmendForm): SessionAmmend => {
    const sessionTypeCode = amendSessionForm.sessionTypeCode
    const durationInSeconds = Math.floor(amendSessionForm.durationInMinutes.valueOf() * 60)
    const startTime = moment.utc(moment(amendSessionForm.startTime, 'HH:mm')).format('HH:mm');

    return {
        sessionTypeCode: sessionTypeCode,
        durationInSeconds: durationInSeconds,
        startTime: startTime,
        id: undefined,
        userTransactionId: undefined,
        version: undefined
    }
}

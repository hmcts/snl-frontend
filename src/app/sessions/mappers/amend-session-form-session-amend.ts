import * as moment from 'moment';
import { SessionAmmendForm } from '../models/ammend/session-ammend-form.model';
import { SessionAmmend } from '../models/ammend/session-ammend.model';
import { SessionAmendResponse } from '../models/session-amend.response';

export const SessionToAmendSessionForm = (session: SessionAmendResponse): SessionAmmendForm => {
    const durationInMinutes = moment.duration(session.duration).asMinutes();
    const startTime = moment(session.start).format('HH:mm');
    const startDate = moment(session.start);
    const sessionTypeCode = session.sessionTypeCode;
    const personName = session.personName || '(No judge)';
    const roomName = session.roomName || '(No room)';
    const roomType = session.roomDescription || '';

    return {
        id: session.id,
        version: session.version,
        durationInMinutes: durationInMinutes,
        startTime: startTime,
        startDate: startDate,
        sessionTypeCode: sessionTypeCode,
        personName: personName,
        roomName: roomName,
        roomTypeDescription: roomType,
        hearingPartCount: session.hearingPartsCount,
        multiSession: session.hasMultiSessionHearingAssigned
    }
}

export const AmendSessionFormToSessionAmend = (amendSessionForm: SessionAmmendForm): SessionAmmend => {
    const sessionTypeCode = amendSessionForm.sessionTypeCode
    const durationInSeconds = Math.floor(amendSessionForm.durationInMinutes.valueOf() * 60)
    const startTime = moment.utc(moment(amendSessionForm.startTime, 'HH:mm')).format('HH:mm');

    return {
        sessionTypeCode: sessionTypeCode,
        durationInSeconds: durationInSeconds,
        startTime: startTime,
        id: amendSessionForm.id,
        userTransactionId: undefined,
        version: amendSessionForm.version,
    }
}

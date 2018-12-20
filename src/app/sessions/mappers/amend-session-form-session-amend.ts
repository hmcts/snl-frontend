import * as moment from 'moment';
import { SessionAmmendForm } from '../models/ammend/session-ammend-form.model';
import { SessionAmmend } from '../models/ammend/session-ammend.model';
import { SessionAmendResponse } from '../models/session-amend.response';

export const SessionToAmendSessionForm = (sessionAmendResponse: SessionAmendResponse): SessionAmmendForm => {
    const durationInMinutes = moment.duration(sessionAmendResponse.duration).asMinutes();
    const startTime = moment(sessionAmendResponse.start).format('HH:mm');
    const startDate = moment(sessionAmendResponse.start);
    const sessionTypeCode = sessionAmendResponse.sessionTypeCode;
    const personName = sessionAmendResponse.personName || '(No judge)';
    const roomName = sessionAmendResponse.roomName || '(No room)';
    const roomType = sessionAmendResponse.roomDescription || '';

    return {
        id: sessionAmendResponse.id,
        version: sessionAmendResponse.version,
        durationInMinutes: durationInMinutes,
        startTime: startTime,
        startDate: startDate,
        sessionTypeCode: sessionTypeCode,
        personName: personName,
        roomName: roomName,
        roomTypeDescription: roomType,
        hearingPartCount: sessionAmendResponse.hearingPartsCount,
        multiSession: sessionAmendResponse.hasMultiSessionHearingAssigned,
        hasListedHearingParts: sessionAmendResponse.hasListedHearingParts
    }
}

export const AmendSessionFormToSessionAmend = (amendSessionForm: SessionAmmendForm): SessionAmmend => {
    const sessionTypeCode = amendSessionForm.sessionTypeCode;
    const durationInSeconds = Math.floor(amendSessionForm.durationInMinutes.valueOf() * 60)
    let startTime = moment(amendSessionForm.startTime, 'HH:mm');
    startTime = moment.utc(amendSessionForm.startDate.hour(startTime.hour()).minutes(startTime.minute()));

    return {
        sessionTypeCode: sessionTypeCode,
        durationInSeconds: durationInSeconds,
        startTime,
        id: amendSessionForm.id,
        userTransactionId: undefined,
        version: amendSessionForm.version,
    }
}

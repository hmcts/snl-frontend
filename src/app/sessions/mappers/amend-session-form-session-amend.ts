import * as moment from 'moment';
import { SessionAmmendForm } from '../models/ammend/session-ammend-form.model';
import { SessionAmmend } from '../models/ammend/session-ammend.model';
import { SessionViewModel } from '../models/session.viewmodel';

export const SessionToAmendSessionForm = (session: SessionViewModel): SessionAmmendForm => {
    const durationInMinutes = moment.duration(session.duration).asMinutes();
    const startTime = moment(session.start).format('HH:mm');
    const startDate = session.start;
    const sessionTypeCode = session.sessionType.code;
    const personName = session.person !== undefined ? session.person.name : '';
    const roomName = session.room !== undefined ? session.room.name : '';
    const roomType = session.room !== undefined ? session.room.id : '';
    const hearingPartCount = session.hearingParts !== undefined ? session.hearingParts.length : 0;

    return {
        durationInMinutes: durationInMinutes,
        startTime: startTime,
        startDate: startDate,
        sessionTypeCode: sessionTypeCode,
        personName: personName,
        roomName: roomName,
        roomType: roomType,
        hearingPartCount: hearingPartCount
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
        version: undefined,
        personId: amendSessionForm.personName,
        roomId: amendSessionForm.roomName
    }
}

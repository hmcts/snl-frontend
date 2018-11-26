import * as moment from 'moment';
import { SessionAmmendForm } from '../models/ammend/session-ammend-form.model';
import { SessionAmmend } from '../models/ammend/session-ammend.model';
import { SessionViewModel } from '../models/session.viewmodel';
import { RoomType } from '../../core/reference/models/room-type';

export const SessionToAmendSessionForm = (session: SessionViewModel, roomTypes: RoomType[]): SessionAmmendForm => {
    const durationInMinutes = moment.duration(session.duration).asMinutes();
    const startTime = moment(session.start).format('HH:mm');
    const startDate = session.start;
    const sessionTypeCode = session.sessionType.code;
    const personName = session.person !== undefined ? session.person.name : '(No judge)';
    const roomName = session.room !== undefined ? session.room.name : '(No room)';
    const roomType = session.room !== undefined ? roomTypes.find(rt => rt.code === session.room.roomTypeCode).description : '';
    const hearingPartCount = session.hearingParts !== undefined ? session.hearingParts.length : 0;

    return {
        id: session.id,
        version: session.version,
        durationInMinutes: durationInMinutes,
        startTime: startTime,
        startDate: startDate,
        sessionTypeCode: sessionTypeCode,
        personName: personName,
        roomName: roomName,
        roomType: roomType,
        hearingPartCount: hearingPartCount,
        multiSession: session.hearingParts.find(hp => hp.multiSession) !== undefined
    } as SessionAmmendForm
}

export const AmendSessionFormToSessionAmend = (amendSessionForm: SessionAmmendForm): SessionAmmend => {
    const sessionTypeCode = amendSessionForm.sessionTypeCode;
    const durationInSeconds = Math.floor(amendSessionForm.durationInMinutes.valueOf() * 60)
    let startTime = moment(amendSessionForm.startTime, 'HH:mm');
    startTime = moment.utc(amendSessionForm.startDate.hour(startTime.hour()).minutes(startTime.minute()));
    const formattedStartTime = startTime.format('HH:mm');

    return {
        sessionTypeCode: sessionTypeCode,
        durationInSeconds: durationInSeconds,
        startTime: formattedStartTime,
        id: amendSessionForm.id,
        userTransactionId: undefined,
        version: amendSessionForm.version,
    }
}

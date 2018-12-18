import { SessionCalendarViewModel } from '../../sessions/models/session.viewmodel';
import { HearingPartViewModel } from '../../hearing-part/models/hearing-part.viewmodel';
import { UpdateEventModel } from '../../common/ng-fullcalendar/models/updateEventModel';
import { CalendarEventSessionViewModel } from '../types/calendar-event-session-view-model.type';
import * as moment from 'moment'
import { Status } from '../../core/reference/models/status.model';
import { SessionModificationValidator } from './session-modification.validator';

describe('SessionModificationValidator', () => {
    verifyValidator('minStartAndEndTime', 'minDuration', 'minutes')
    verifyValidator('canChangeDay', 'canChangeDay', 'days')
});

function verifyValidator(validatorName: string, validatorKey: string, unit: moment.DurationInputArg2) {
    let startTime = moment()
    let endTime = moment(startTime).add(1, 'hour')

    describe(validatorName, () => {
        describe('should return null', () => {
            it('when session do not contains any listed hearing parts', () => {
                const event = eventGenerator(Status.Unlisted, startTime, endTime, startTime, endTime)
                expect(SessionModificationValidator[validatorName](event)).toBeNull()
            });
            it('when delta in event is equal 0', () => {
                const event = eventGenerator(Status.Listed, startTime, endTime, startTime, endTime)
                expect(SessionModificationValidator[validatorName](event)).toBeNull()
            });
        });

        describe('should return error object', () => {
            it(`that contains '${validatorKey}' property`, () => {
                const newStartTime = moment(startTime).add(5, unit)
                const event = eventGenerator(Status.Listed, startTime, endTime, newStartTime, endTime)
                expect(SessionModificationValidator[validatorName](event)[validatorKey]).not.toBeNull()
            });

            it('when new session start time was set to be later', () => {
                const newStartTime = moment(startTime).add(5, unit)
                const event = eventGenerator(Status.Listed, startTime, endTime, newStartTime, endTime)
                expect(SessionModificationValidator[validatorName](event)).not.toBeNull()
            });

            it('when new end time was set to be earlier', () => {
                const newEndTime = moment(endTime).subtract(5, unit)
                const event = eventGenerator(Status.Listed, startTime, endTime, startTime, newEndTime)
                expect(SessionModificationValidator[validatorName](event)).not.toBeNull()
            });
        });
    });
}

function eventGenerator(
    hpStatus: Status,
    sessionStartTime: moment.Moment,
    sessionEndTime: moment.Moment,
    newStartTime: moment.Moment,
    newEndTime: moment.Moment) {
    const duration = moment.duration(sessionEndTime.diff(sessionStartTime))
    const delta = moment.duration(newEndTime.diff(newStartTime))

    const sessionCalendarViewModel: SessionCalendarViewModel = {
        hearingParts: [{status: hpStatus} as HearingPartViewModel],
        startDate: sessionStartTime,
        duration,
        start: newStartTime,
        end: newEndTime,
        sessionType: undefined,
        version: 1,
        room: undefined,
        person: undefined,
        title: '',
        id: 'someId',
    };

    const updateEvent: UpdateEventModel<SessionCalendarViewModel> = {
        event: sessionCalendarViewModel,
        delta,
        revertFunc: () => { },
        jsEvent: undefined,
        ui: undefined,
        view: undefined,
    }

    const event: CalendarEventSessionViewModel = new CustomEvent<UpdateEventModel<SessionCalendarViewModel>>(
        'eventName', {
        detail: updateEvent,
    });

    return event;
}

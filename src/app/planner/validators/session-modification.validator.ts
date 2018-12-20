import { ValidationError } from '../services/validator';
import { CalendarEventSessionViewModel } from '../types/calendar-event-session-view-model.type';
import * as moment from 'moment';
import { Status } from '../../core/reference/models/status.model';

export class SessionModificationValidator {
    static minStartAndEndTime(event: CalendarEventSessionViewModel): ValidationError | null {
        if (!SessionModificationValidator.containsAsLeastOneListedHearingPart(event)
            || event.detail.delta.asMilliseconds() === 0) { return null }
        const sessionStartTime = event.detail.event.startDate
        const startDateMovedToTheRight = sessionStartTime.isBefore(event.detail.event.start)
        const originalEnd = moment(sessionStartTime).add(event.detail.event.duration)
        const endDateMovedToTheLeft = originalEnd.isAfter(event.detail.event.end)

        if (startDateMovedToTheRight || endDateMovedToTheLeft) {
            return {
                minDuration: {
                    humanReadableMsg: `Session that contains at least one listed hearing part should `
                        + `start at least ${sessionStartTime.format('DD/MM/YYYY HH:mm')} `
                        + `and end at ${originalEnd.format('DD/MM/YYYY HH:mm')}.`
                }
            };
        }

        return null
    }

    static canChangeDay(event: CalendarEventSessionViewModel): ValidationError | null {
        if (!SessionModificationValidator.containsAsLeastOneListedHearingPart(event)) { return null }
        const sessionStartTime = event.detail.event.startDate
        const originalEnd = moment(sessionStartTime).add(event.detail.event.duration)

        if (event.detail.event.start.days() !== event.detail.event.startDate.days()
            || event.detail.event.end.days() !== originalEnd.days()) {

            return {
                canChangeDay: {
                    humanReadableMsg: `Cannot change start/end date of session that contains at least one listed hearing part.`
                }
            };
        }

        return null;
    }

    private static containsAsLeastOneListedHearingPart(event: CalendarEventSessionViewModel) {
        return event.detail.event.hearingParts.filter(hpvm => hpvm.status === Status.Listed).length > 0
    }
}

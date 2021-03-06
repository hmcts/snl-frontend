import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.state';
import { getRoomById } from '../../rooms/reducers';
import { getJudgeById } from '../../judges/reducers';
import { Separator } from '../../core/callendar/transformers/data-with-simple-resource-transformer';
import { Room } from '../../rooms/models/room.model';
import { Judge } from '../../judges/models/judge.model';
import { safe } from '../../utils/js-extensions';
import { CalendarEventSessionViewModel } from '../types/calendar-event-session-view-model.type';

@Injectable()
export class SummaryMessageService {
    constructor(private readonly store: Store<State>) { }

    public buildSummaryMessage(event: CalendarEventSessionViewModel): Observable<string> {
        if (event.detail.event === undefined) {
            return this.buildListHearingMsg();
        }

        let [resourceType, resourceId] = event.detail.event.resourceId.split(`${Separator}`);
        const isTimeChanged = this.isTimeChanged(event);
        const isResourceChanged = this.isResourceChanged(event, resourceType, resourceId);

        if (isTimeChanged && !isResourceChanged) {
            // do not produce summary msg when only time of session has changed
            return Observable.of(null)
        } else {
            return (resourceId === 'empty') ?
                this.buildUnassignedMsg(resourceType, event) :
                this.buildAssignedMsg(resourceType, resourceId)
        }
    }

    private isTimeChanged(event: CalendarEventSessionViewModel): boolean {
        return event.detail.delta.asMilliseconds() !== 0;
    }

    private isResourceChanged(event: CalendarEventSessionViewModel, resourceType: string, resourceId: string): boolean {
        const roomId = safe(() => event.detail.event.room.id) || 'empty'
        const personId = safe(() => event.detail.event.person.id) || 'empty'

        if (resourceType === 'room') {
            return roomId !== resourceId;
        } else {
            return personId !== resourceId
        }
    }

    private buildAssignedMsg(resourceType: string, resourceId: string): Observable<string> {
        let assignedMsg$ = Observable.of('Judge or Room has been assigned')
        if (resourceType === 'room') {
            assignedMsg$ = this.store.select(getRoomById(resourceId)).map((room: Room) => `${room.name} has been assigned`)
        } else if (resourceType === 'person') {
            assignedMsg$ = this.store.select(getJudgeById(resourceId)).map((judge: Judge) => `${judge.name} has been assigned`)
        }

        return assignedMsg$
    }

    private buildUnassignedMsg(resourceType: string, event: CalendarEventSessionViewModel): Observable<string> {
        let resourceName = 'Judge or Room'
        if (resourceType === 'room') {
            resourceName = event.detail.event.room.name
        } else if (resourceType === 'person') {
            resourceName = event.detail.event.person.name
        }

        return Observable.of(`${resourceName} has been unassigned`)
    }

    private buildListHearingMsg(): Observable<string> {
        return Observable.of('Hearing part has been listed!')
    }
}

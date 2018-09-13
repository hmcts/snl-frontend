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

@Injectable()
export class SummaryMessageService {
    constructor(private readonly store: Store<State>) { }

    public buildSummaryMessage(event): Observable<string> {
        const eventDetails = event.detail.event;
        let [resourceType, resourceId] = eventDetails.resourceId.split(`${Separator}`);
        const isTimeChanged = this.isTimeChanged(event);
        const isResourcedChanged = this.isResourcedChanged(event, resourceType, resourceId);

        if (isTimeChanged && !isResourcedChanged) {
            // do not produce summary msg when only time of session has changed
            return Observable.of(null)
        } else {
            return (resourceId === 'empty') ?
                this.buildUnassignedMsg(resourceType, event.detail.event) :
                this.buildAssignedMsg(resourceType, resourceId)
        }
    }

    private isTimeChanged(event): boolean {
        return event.detail.duration.asMilliseconds() > 0
    }

    private isResourcedChanged(event, resourceType, resourceId): boolean {
        const roomId = safe(() => event.detail.event.room.id)
        const personId = safe(() => event.detail.event.person.id)

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

    private buildUnassignedMsg(resourceType: string, event: any): Observable<string> {
        let resourceName = 'Judge or Room'
        if (resourceType === 'room') {
            resourceName = event.room.name
        } else if (resourceType === 'person') {
            resourceName = event.judge.name
        }

        return Observable.of(`${resourceName} has been unassigned`)
    }
}

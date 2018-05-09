import { Component, OnInit } from '@angular/core';
import { SessionCreate } from '../../../sessions/models/session-create.model';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as RoomActions from '../../../rooms/actions/room.action';
import { Store } from '@ngrx/store';
import * as SessionActions from '../../../sessions/actions/session.action';
import { State } from '../../../app.state';
import { v4 as uuid } from 'uuid';
import { HearingPart } from '../../models/hearing-part';
import * as moment from 'moment'

@Component({
    selector: 'app-listing-create',
    templateUrl: './listing-create.component.html',
    styleUrls: ['./listing-create.component.scss']
})
export class ListingCreateComponent implements OnInit {
    hearings: string[];
    caseTypes: string[];
    time;

    listing: HearingPart;

    constructor(private store: Store<State>) {
        this.hearings = ['Preliminary Hearing', 'Trial Hearing', 'Adjourned Hearing'];
        this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];

        this.listing = {
            id: undefined,
            caseNumber: undefined,
            caseType: undefined,
            hearingType: undefined,
            duration: moment.duration(0),
            scheduleStart: undefined,
            scheduleEnd: undefined,
        } as HearingPart;
    }

    create() {
        // let time_arr = this.time.split(':');
        // this.listing.start.setHours(time_arr[0]);
        // this.listing.start.setMinutes(time_arr[1]);
        // this.listing.id = uuid();
        // this.store.dispatch(new SessionActions.Create(this.listing));
    }

    ngOnInit() {
    }

}

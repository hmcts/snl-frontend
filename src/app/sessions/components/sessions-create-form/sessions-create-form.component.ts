import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { SessionCreate } from '../../models/session-create.model';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';

@Component({
    selector: 'app-sessions-create-form',
    templateUrl: './sessions-create-form.component.html',
    styleUrls: ['./sessions-create-form.component.scss']
})
export class SessionsCreateFormComponent implements OnInit, OnChanges {

    private _session: SessionCreate;
    durationInMinutes: number;
    caseTypes: string[];
    time: string;
    roomsPlaceholder: string;
    judgesPlaceholder: string;

    get session(): SessionCreate {
        return this._session;
    }

    @Input() set session(value: SessionCreate) {
        this._session = value;
        this.recalculateViewData();
    }

    @Input() judges: Judge[];
    @Input() rooms: Room[];
    @Input() roomsLoading: boolean;
    @Input() judgesLoading: boolean;
    @Output() onCancel = new EventEmitter();
    @Output() createSession = new EventEmitter();

    constructor() {
        this.session = {
            userTransactionId: undefined,
            id: undefined,
            start: moment().toDate(),
            duration: 30,
            roomId: null,
            personId: null,
            caseType: null,
        } as SessionCreate;
        this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];
        this.recalculateViewData();
    }

    private recalculateViewData() {
        if (this.session.duration !== undefined) {
            this.durationInMinutes = Math.floor(this.session.duration / 60);
        } else {
            this.durationInMinutes = 0;
        }
        this.time = moment(this.session.start).format('HH:mm');
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.roomsPlaceholder = this.roomsLoading ? 'Loading the rooms...' : 'Select the room';
        this.judgesPlaceholder = this.judgesLoading ? 'Loading the judges...' : 'Select the judge';
    }

    create() {
        this.session.id = (this.session.id === undefined) ? uuid() : this.session.id;
        let time_arr = this.time.split(':');
        this.session.start.setHours(+time_arr[0]);
        this.session.start.setMinutes(+time_arr[1]);
        this.session.duration = this.durationInMinutes.valueOf() * 60;

        this.createSession.emit(this.session);
    }

    cancel() {
        this.onCancel.emit(this.session);
    }

    showCancelButton(): boolean {
        return this.cancel !== undefined;
    }
}

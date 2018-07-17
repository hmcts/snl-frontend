import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class SessionsCreateFormComponent {

    public static LOADING_ROOMS_PLACEHOLDER = 'Loading the rooms...';
    public static LOADING_JUDGES_PLACEHOLDER = 'Loading the judges...';
    public static SELECT_ROOM_PLACEHOLDER = 'Select the room';
    public static SELECT_JUDGE_PLACEHOLDER = 'Select the judge';

    session: SessionCreate;
    durationInMinutes: number;
    caseTypes: string[];
    time: string;
    roomsPlaceholder: string;
    judgesPlaceholder: string;

    @Input() set sessionData(value: SessionCreate) {
        if (value === undefined || value == null) {
            return;
        }
        this.session = value;
        this.recalculateViewData();
    }

    @Input() judges: Judge[];
    @Input() rooms: Room[];
    @Input() set roomsLoading(roomsLoading: boolean) {
        this.roomsPlaceholder = roomsLoading ?
            SessionsCreateFormComponent.LOADING_ROOMS_PLACEHOLDER :
            SessionsCreateFormComponent.SELECT_ROOM_PLACEHOLDER;
    };
    @Input() set judgesLoading(judgesLoading: boolean) {
        this.judgesPlaceholder = judgesLoading ?
            SessionsCreateFormComponent.LOADING_JUDGES_PLACEHOLDER :
            SessionsCreateFormComponent.SELECT_JUDGE_PLACEHOLDER;
    };
    @Output() createSessionAction = new EventEmitter();
    @Output() cancelAction = new EventEmitter();

    constructor() {
        this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];

        this.roomsPlaceholder = SessionsCreateFormComponent.LOADING_ROOMS_PLACEHOLDER;
        this.judgesPlaceholder = SessionsCreateFormComponent.LOADING_JUDGES_PLACEHOLDER;

        this.session = {
            userTransactionId: undefined,
            id: undefined,
            start: moment(),
            duration: 1800,
            roomId: null,
            personId: null,
            caseType: this.caseTypes[0],
        } as SessionCreate;
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

    create() {
        this.session.id = (this.session.id === undefined) ? uuid() : this.session.id;
        const timeArr = this.time.split(':');
        this.session.start.set('hours', +timeArr[0])
        this.session.start.set('minutes', +timeArr[1])
        this.session.duration = this.durationInMinutes.valueOf() * 60;

        this.createSessionAction.emit(this.session);
        this.session.id = undefined;
    }

    cancel() {
        this.cancelAction.emit(null);
    }

    showCancelButton(): boolean {
        return this.cancelAction.observers.length > 0;
    }
}

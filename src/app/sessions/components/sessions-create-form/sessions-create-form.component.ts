import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { SessionCreate } from '../../models/session-create.model';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { CaseType } from '../../../core/reference/models/case-type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Moment } from 'moment';

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

    sessionCreate: SessionCreate;
    durationInMinutes: number;
    time: string;
    roomsPlaceholder: string;
    judgesPlaceholder: string;

    form: FormGroup;

    @Input() set sessionData(value: SessionCreate) {
        if (value === undefined || value == null) {
            this.initEmptySessionCreate()
        } else {
            this.sessionCreate = value
        }

        this.recalculateViewData()
        this.initForm()
    }

    private initEmptySessionCreate() {
        this.sessionCreate = {
            userTransactionId: undefined,
            id: undefined,
            start: moment(),
            duration: 1800,
            roomId: null,
            personId: null,
            caseType: null,
        } as SessionCreate
    }

    @Input() judges: Judge[];
    @Input() rooms: Room[];

    @Input() set caseTypes(values: CaseType[]) {
        if (values === undefined || values.length === 0) {
            return;
        }
        this.sessionCreate.caseType = values[0].code;
        this.localCaseTypes = values;
    }

    localCaseTypes: CaseType[];

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

        this.roomsPlaceholder = SessionsCreateFormComponent.LOADING_ROOMS_PLACEHOLDER;
        this.judgesPlaceholder = SessionsCreateFormComponent.LOADING_JUDGES_PLACEHOLDER;

        this.initEmptySessionCreate()
        this.recalculateViewData();
        this.initForm()
    }

    private initForm() {
        this.form = new FormGroup( {
            startDate: new FormControl(
                this.getDateFromMoment(this.sessionCreate.start), Validators.required
            ),
            startTime: new FormControl(
                this.getTimeFromMoment(this.sessionCreate.start), Validators.required
            ),
            duration: new FormControl(this.sessionCreate.duration, Validators.required),
            room: new FormControl(this.sessionCreate.roomId, Validators.required),
            judge: new FormControl(this.sessionCreate.personId, Validators.required),
            caseType: new FormControl(this.sessionCreate.caseType, Validators.required),
        })
    }

    private getTimeFromMoment(moment: Moment): string {
        return moment.format('HH:ss')
    }

    private getDateFromMoment(moment: Moment): string {
        return '10:10'
    }

    private recalculateViewData() {
        if (this.sessionCreate.duration !== undefined) {
            this.durationInMinutes = Math.floor(this.sessionCreate.duration / 60);
        } else {
            this.durationInMinutes = 0;
        }
        this.time = moment(this.sessionCreate.start).format('HH:mm');
    }

    create() {
        this.sessionCreate.id = (this.sessionCreate.id === undefined) ? uuid() : this.sessionCreate.id;
        const timeArr = this.time.split(':');
        this.sessionCreate.start.set('hours', +timeArr[0]);
        this.sessionCreate.start.set('minutes', +timeArr[1]);
        this.sessionCreate.duration = this.durationInMinutes.valueOf() * 60;

        this.createSessionAction.emit(this.sessionCreate);
        this.sessionCreate.id = undefined;
    }

    cancel() {
        this.cancelAction.emit(null);
    }

    showCancelButton(): boolean {
        return this.cancelAction.observers.length > 0;
    }
}

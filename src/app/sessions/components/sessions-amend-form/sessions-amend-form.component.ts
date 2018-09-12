import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { SessionCreate } from '../../models/session-create.model';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { SessionType } from '../../../core/reference/models/session-type';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { safe } from '../../../utils/js-extensions';
import * as Mapper from '../../mappers/create-session-form-session-create';
import { SessionAmmendForm } from '../../models/ammend/session-ammend-form.model';
import { SessionAmmend } from '../../models/ammend/session-ammend.model';

@Component({
    selector: 'app-sessions-amend-form',
    templateUrl: './sessions-amend-form.component.html',
    styleUrls: ['./sessions-amend-form.component.scss']
})
export class SessionsAmendFormComponent {
    public static LOADING_ROOMS_PLACEHOLDER = 'Loading the rooms...';
    public static LOADING_JUDGES_PLACEHOLDER = 'Loading the judges...';
    public static SELECT_ROOM_PLACEHOLDER = 'Select the room';
    public static SELECT_JUDGE_PLACEHOLDER = 'Select the judge';

    injectedSessionAmend: SessionAmmend;
    amendSessionForm: SessionAmmendForm;
    roomsPlaceholder: string;
    judgesPlaceholder: string;
    sessionAmendFormGroup: FormGroup;

    @Input() set sessionData(value: SessionAmmend) {
        if (value === undefined || value == null) {
            return;
        }
        this.injectedSessionAmend = value;
        this.amendSessionForm = Mapper.SessionCreateToCreateSessionForm(value);
    }

    @Input() judges: Judge[];
    @Input() rooms: Room[];
    @Input() sessionTypes: SessionType[];

    @Input() set roomsLoading(roomsLoading: boolean) {
        this.roomsPlaceholder = roomsLoading ?
            SessionsAmendFormComponent.LOADING_ROOMS_PLACEHOLDER :
            SessionsAmendFormComponent.SELECT_ROOM_PLACEHOLDER;
    };

    @Input() set judgesLoading(judgesLoading: boolean) {
        this.judgesPlaceholder = judgesLoading ?
            SessionsAmendFormComponent.LOADING_JUDGES_PLACEHOLDER :
            SessionsAmendFormComponent.SELECT_JUDGE_PLACEHOLDER;
    };

    @Output() amendSessionAction = new EventEmitter<SessionCreate>();
    @Output() cancelAction = new EventEmitter();

    constructor() {
        this.roomsPlaceholder = SessionsAmendFormComponent.LOADING_ROOMS_PLACEHOLDER;
        this.judgesPlaceholder = SessionsAmendFormComponent.LOADING_JUDGES_PLACEHOLDER;
        this.amendSessionForm = {
            startDate: moment(),
            startTime: moment().format('HH:mm'),
            durationInMinutes: 30,
            sessionTypeCode: null
        };
        this.initiateFormGroup();
    }

    create() {
        const sessionCreate = Mapper.CreateSessionFormToSessionCreate(this.amendSessionForm)
        sessionCreate.id = safe(() => this.injectedSessionAmend.id) || uuid()

        this.amendSessionAction.emit(sessionCreate);
    }

    cancel() {
        this.cancelAction.emit(null);
    }

    showCancelButton(): boolean {
        return this.cancelAction.observers.length > 0;
    }

    private initiateFormGroup() {
        this.sessionAmendFormGroup = new FormGroup({
            sessionTypeCode: new FormControl(this.amendSessionForm.sessionTypeCode, Validators.required),
            startDate: new FormControl(this.amendSessionForm.startDate, [Validators.required]),
            startTime: new FormControl(this.amendSessionForm.startTime, [Validators.required]),
            durationInMinutes: new FormControl(this.amendSessionForm.durationInMinutes, [Validators.required, Validators.min(1)]),
        });
    }
}

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { Room } from '../../../rooms/models/room.model';
import { SessionCreate } from '../../models/session-create.model';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { SessionType } from '../../../core/reference/models/session-type';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { safe } from '../../../utils/js-extensions';
import { CreateSessionForm } from '../../models/create-session-form.model';
import * as Mapper from '../../mappers/create-session-form-session-create';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { SessionCreateNotesConfiguration } from '../../models/session-create-notes-configuration.model';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { NoteType } from '../../../notes/models/note-type';

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

    @ViewChild(NoteListComponent) noteList: NoteListComponent;

    newNoteViewModels: NoteViewmodel[];
    injectedSessionCreate: SessionCreate;
    createSessionForm: CreateSessionForm;
    roomsPlaceholder: string;
    judgesPlaceholder: string;
    sessionCreateFormGroup: FormGroup;

    @Input() set sessionData(value: SessionCreate) {
        if (value === undefined || value == null) {
            return;
        }
        this.injectedSessionCreate = value;
        this.createSessionForm = Mapper.SessionCreateToCreateSessionForm(value);
    }

    @Input() judges: Judge[];
    @Input() rooms: Room[];
    @Input() sessionTypes: SessionType[];

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

    constructor(readonly sessionNotesConfig: SessionCreateNotesConfiguration,
                public notePreparerService: NotesPreparerService) {
        this.roomsPlaceholder = SessionsCreateFormComponent.LOADING_ROOMS_PLACEHOLDER;
        this.judgesPlaceholder = SessionsCreateFormComponent.LOADING_JUDGES_PLACEHOLDER;
        this.createSessionForm = {
            startDate: moment(),
            startTime: moment().format('HH:mm'),
            durationInMinutes: 30,
            roomId: null,
            personId: null,
            sessionTypeCode: null
        };
        this.initiateFormGroup();
        this.newNoteViewModels = [sessionNotesConfig.noteViewModelOf(NoteType.OTHER_NOTE)];
    }

    create() {
        const sessionCreate = Mapper.CreateSessionFormToSessionCreate(this.createSessionForm)
        sessionCreate.id = safe(() => this.injectedSessionCreate.id) || uuid();

        this.createSessionAction.emit({session: sessionCreate, notes: this.prepareNotes(sessionCreate.id)});
    }

    cancel() {
        this.cancelAction.emit(null);
    }

    showCancelButton(): boolean {
        return this.cancelAction.observers.length > 0;
    }

    prepareNotes(sessionId) {
        let notes = this.notePreparerService.prepare(
            this.noteList.getModifiedNotes(),
            sessionId,
            this.sessionNotesConfig.entityName
        );

        return this.notePreparerService.removeEmptyNotes(notes);
    }

    private addLeadingZeros(value: string): string {
        while (value.length < 2) {
            value = `0${value}`;
        }
        return value;
    }

    private getNormalizedNumericString(value: string, maxValue: number): string {
        const intValue = parseInt(value, 10);
        if (isNaN(intValue) || intValue < 0) {
            return '00';
        }

        if (intValue > maxValue) {
            return this.addLeadingZeros(maxValue.toString());
        }

        return this.addLeadingZeros(intValue.toString());
    }

    private getHours(time: string): string {
        const value = time.split(':')[0].substr(0, 2);

        return this.getNormalizedNumericString(value, 23);
    }

    private getMinutes(time: string): string {
        const timeArray = time.split(':');
        const value = timeArray.length === 1 ? timeArray[0].substr(2) : timeArray[1];

        return this.getNormalizedNumericString(value, 59);
    }

    formatTime(event) {

        const time = event.target.value;
        console.log('event', event, time);

        const hour = this.getHours(time);
        const minute = this.getMinutes(time)

        console.log(hour, minute, `${this.getHours(time)}:${this.getMinutes(time)}`)

        event.target.value = this.createSessionForm.startTime = `${this.getHours(time)}:${this.getMinutes(time)}`
    }

    private formatDate(dateObj): string {
        return `${dateObj.date}/${dateObj.month}/${dateObj.year}`;
    }

    private initiateFormGroup() {
        this.sessionCreateFormGroup = new FormGroup({
            sessionTypeCode: new FormControl(this.createSessionForm.sessionTypeCode, Validators.required),
            startDate: new FormControl(this.createSessionForm.startDate, [Validators.required, (input) => {
                const d = input.value;
                const date = d && ((d._isAMomentObject && typeof d._i === 'string' && d._i)
                    || (typeof d._i === 'object' && this.formatDate(d._i)))
                    || null;

                console.log('let me validate DATE for you!', input, date, typeof date);

                if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
                    console.log('DATE valid');
                    return null;
                }
                console.log('DATE is INvalid');
                return { error: 'wrong format' };
            }]),
            startTime: new FormControl(this.createSessionForm.startTime, [Validators.required, (input) => {
                console.log('let me validate TIME for you!', input);
                if (/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(input.value)) {
                    console.log('time valid');
                    return null;
                }
                console.log('Time is INvalid');
                return { error: 'wrong format' };
            }]),
            durationInMinutes: new FormControl(
                this.createSessionForm.durationInMinutes, [Validators.required, Validators.min(1)]
            ),
        });
    }
}

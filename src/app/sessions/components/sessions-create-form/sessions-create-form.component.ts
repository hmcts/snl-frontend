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
import { getNoteViewModel, NoteViewmodel } from '../../../notes/models/note.viewmodel';

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

    noteViewModels: NoteViewmodel[];
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
        this.noteViewModels = sessionNotesConfig.defaultNotes()
            .map(getNoteViewModel)
            .map(n => this.setCustomInputLabel(n, 'Notes'));
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

    private setCustomInputLabel(note: NoteViewmodel, inputLabel: string) {
        note.inputLabel = inputLabel;
        return note;
    }

    private initiateFormGroup() {
        this.sessionCreateFormGroup = new FormGroup({
            sessionTypeCode: new FormControl(this.createSessionForm.sessionTypeCode, Validators.required),
            startDate: new FormControl(this.createSessionForm.startDate, [Validators.required]),
            startTime: new FormControl(this.createSessionForm.startTime, [Validators.required]),
            durationInMinutes: new FormControl(this.createSessionForm.durationInMinutes, [Validators.required, Validators.min(1)]),
        });
    }
}

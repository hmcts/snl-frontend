import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SessionType } from '../../../core/reference/models/session-type';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import * as Mapper from '../../mappers/amend-session-form-session-amend';
import { SessionAmmendForm } from '../../models/ammend/session-ammend-form.model';
import { SessionAmmend } from '../../models/ammend/session-ammend.model';
import { v4 as uuid } from 'uuid';
import { SessionsCreationService } from '../../services/sessions-creation.service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import * as fromNotes from '../../../notes/actions/notes.action';
import { Note } from '../../../notes/models/note.model';
import { NoteViewmodel, getNoteViewModel } from '../../../notes/models/note.viewmodel';
import { SessionCreateNotesConfiguration } from '../../models/session-create-notes-configuration.model';
import { NoteType } from '../../../notes/models/note-type';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';
import { SessionAmendValidator } from '../../../core/validators/session-amend.validators';
import * as moment from 'moment';

@Component({
    selector: 'app-sessions-amend-form',
    templateUrl: './sessions-amend-form.component.html',
    styleUrls: ['./sessions-amend-form.component.scss']
})
export class SessionsAmendFormComponent {
    amendSessionForm: SessionAmmendForm;
    sessionAmendFormGroup: FormGroup;
    newNoteViewModels: NoteViewmodel[] = [this.sessionNotesConfig.noteViewModelOf(NoteType.OTHER_NOTE)];
    oldNoteViewModels: NoteViewmodel[] = [];
    @ViewChild('newNoteList') newNoteList: NoteListComponent;
    @ViewChild('sessionAmendForm') sessionFormGroup: FormGroupDirective;

    @Input() set sessionData(session: SessionAmmendForm) {
        this.amendSessionForm = session;
        this.initiateFormGroup();
    }

    @Input() sessionTypes: SessionType[];
    @Input() set notes(notes: Note[]) { this.oldNoteViewModels = notes.map(getNoteViewModel); }
    @Output() amendSessionAction = new EventEmitter<SessionAmmend>();
    @Output() cancelAction = new EventEmitter();

    constructor(public sessionCreationService: SessionsCreationService,
                public dialog: MatDialog,
                private notePreparerService: NotesPreparerService,
                private sessionNotesConfig: SessionCreateNotesConfiguration,
                private readonly store: Store<State>) {
    }

    amend() {
        const sessionAmend: SessionAmmend = this.prepareSessionAmend(this.amendSessionForm);
        this.sessionCreationService.amend(sessionAmend);
        this.openTransactionDialog().afterClosed().subscribe(() => {
            this.createNote();
            this.sessionCreationService.fetchUpdatedEntities();
            this.amendSessionAction.emit();
        })
    }

    cancel() {
        this.cancelAction.emit(null);
    }

    createNote() {
        this.store.dispatch(new fromNotes.CreateMany(this.prepareNotes()));
    }

    private prepareNotes() {
        let preparedFreeTextNotes = this.notePreparerService.prepare(
            this.newNoteList.getModifiedNotes(),
            this.amendSessionForm.id,
            this.sessionNotesConfig.entityName
        );

        return preparedFreeTextNotes;
    }

    private openTransactionDialog() {
        return this.dialog.open(TransactionDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: 'Amending session'
        });
    }

    private prepareSessionAmend(form: SessionAmmendForm) {
        let sessionAmend: SessionAmmend = Mapper.AmendSessionFormToSessionAmend(form);
        sessionAmend.userTransactionId = uuid();

        return sessionAmend;
    }

    private initiateFormGroup() {
        const startTimeValidators = [Validators.required]
        const formGroupValidators = []
        let minDuration = 1
        if (this.amendSessionForm.hasListedHearingParts) {
            startTimeValidators.push(SessionAmendValidator.isSameOrBefore(this.amendSessionForm.startTime))
            minDuration = this.amendSessionForm.durationInMinutes
            formGroupValidators.push(this.validateNewSessionEndTimeIsTheSameOrAfterOldSessionEndTime(
                this.amendSessionForm.startTime,
                this.amendSessionForm.durationInMinutes,
                'startTime', 'durationInMinutes'
            ))
        }

        this.sessionAmendFormGroup = new FormGroup({
            sessionTypeCode: new FormControl(this.amendSessionForm.sessionTypeCode, Validators.required),
            startDate: new FormControl({value: this.amendSessionForm.startDate, disabled: true}, [Validators.required]),
            startTime: new FormControl(this.amendSessionForm.startTime, startTimeValidators),
            durationInMinutes: new FormControl(this.amendSessionForm.durationInMinutes, [Validators.required, Validators.min(minDuration)]),
        }, { validators: formGroupValidators });
    }

    private validateNewSessionEndTimeIsTheSameOrAfterOldSessionEndTime(
        originalSessionStartTime: string,
        originalDurationInMinutes: number,
        startTimeKey: string,
        durationInMinutesKey: string) {

            const originalSessionEndTime = moment(originalSessionStartTime, 'HH:mm').add(originalDurationInMinutes, 'minutes')
            return (group: FormGroup): {[key: string]: any} => {
                let startTime = moment(group.controls[startTimeKey].value, 'HH:mm');
                let durationInMinutes = +group.controls[durationInMinutesKey].value;
                const newSessionEndTime = startTime.add(durationInMinutes, 'minutes');
                let error = null;

                if (newSessionEndTime.isBefore(originalSessionEndTime)) {
                    error = { newEndTimeBeforeOldOne: true }
                    group.controls[durationInMinutesKey].markAsTouched();
                }

                group.controls[durationInMinutesKey].setErrors(error)

                return error;
            }
    }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SessionType } from '../../../core/reference/models/session-type';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Mapper from '../../mappers/amend-session-form-session-amend';
import { SessionAmmendForm } from '../../models/ammend/session-ammend-form.model';
import { SessionAmmend } from '../../models/ammend/session-ammend.model';
import { Session } from '../../models/session.model';
import { v4 as uuid } from 'uuid';
import { SessionsCreationService } from '../../services/sessions-creation.service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-sessions-amend-form',
    templateUrl: './sessions-amend-form.component.html',
    styleUrls: ['./sessions-amend-form.component.scss']
})
export class SessionsAmendFormComponent {
    session: Session;
    amendSessionForm: SessionAmmendForm;
    sessionAmendFormGroup: FormGroup;

    @Input() set sessionData(session: Session) {
        this.session = session;
        this.amendSessionForm = Mapper.SessionToAmendSessionForm(this.session);
        this.initiateFormGroup();
    }

    @Input() sessionTypes: SessionType[];

    @Output() amendSessionAction = new EventEmitter<SessionAmmend>();
    @Output() cancelAction = new EventEmitter();

    constructor(public sessionCreationService: SessionsCreationService,
                public dialog: MatDialog) {
    }

    amend() {
        const sessionAmend: SessionAmmend = Mapper.AmendSessionFormToSessionAmend(this.amendSessionForm)
        sessionAmend.id = this.session.id;
        sessionAmend.userTransactionId = uuid();
        sessionAmend.version = this.session.version;

        this.sessionCreationService.amend(sessionAmend);
        this.openTransactionDialog().afterClosed().subscribe((success) => {
            if (success) {
                this.sessionCreationService.fetchUpdatedEntities()
            }
        })
    }

    cancel() {
        this.cancelAction.emit(null);
    }

    private openTransactionDialog() {
        return this.dialog.open(TransactionDialogComponent, {
            data: 'Amending session',
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true
        });
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

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate } from '../../models/listing-create';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { getHearingPartsError } from '../../reducers';
import { GetById } from '../../actions/hearing-part.action';
import { Priority } from '../../models/priority-model';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import * as JudgeActions from '../../../judges/actions/judge.action';
import { Judge } from '../../../judges/models/judge.model';
import * as fromJudges from '../../../judges/reducers';
import { HearingPartModificationService } from '../../services/hearing-part-modification-service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog, MatSelectChange } from '@angular/material';
import * as fromNotes from '../../../notes/actions/notes.action';
import * as fromReferenceData from '../../../core/reference/reducers';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/combineLatest';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import { safe } from '../../../utils/js-extensions';

@Component({
    selector: 'app-listing-create',
    templateUrl: './listing-create.component.html',
    styleUrls: ['./listing-create.component.scss']
})
export class ListingCreateComponent implements OnInit {
    @ViewChild(NoteListComponent) noteList: NoteListComponent;

    @Input() set data(value: ListingCreate) {
        this.listing = value;
        this.listing.notes = this.setNotesIfExist(value);
        this.setFormGroup();
    }

    @Input() editMode = false;

    @Output() onSave = new EventEmitter();

    listingCreate: FormGroup;
    communicationFacilitators = ['None', 'Sign Language', 'Interpreter', 'Digital Assistance', 'Custom'];
    errors = '';
    priorityValues = Object.values(Priority);
    judges: Judge[] = [];
    hearings: HearingType[] = [];

    private _caseTypes: CaseType[] = [];
    get caseTypes(): CaseType[] { return this._caseTypes }
    set caseTypes(caseTypes: CaseType[]) {
        this._caseTypes = caseTypes
        if (safe(() => this.listing.hearingPart.caseType)) {
            this.hearings = this.getHearingTypesFromCaseType(this.listing.hearingPart.caseType);
        }
    }

    caseTitleMaxLength = 200;
    caseNumberMaxLength = 200;

    public listing: ListingCreate;

    constructor(private readonly store: Store<State>,
                public dialog: MatDialog,
                private readonly notePreparerService: NotesPreparerService,
                private readonly hearingPartModificationService: HearingPartModificationService,
                readonly listingNotesConfig: ListingCreateNotesConfiguration) {

        this.store.select(getHearingPartsError).subscribe((error: any) => {
            this.errors = safe(error.message) || '';
        });
        this.store.select(fromJudges.getJudges).withLatestFrom(
            this.store.select(fromReferenceData.selectCaseTypes)
            , (judges, caseTypes: CaseType[]) => {
                this.judges = Object.values(judges);
                this.caseTypes = caseTypes;
            }
        ).subscribe(() => {
            if (!this.editMode) {
                this.initiateListing();
            }
            this.setFormGroup();
        });
    }

    ngOnInit() {
        this.store.dispatch(new JudgeActions.Get());
    }

    save() {
        if (this.editMode) {
            this.edit();
        } else {
            this.create();
        }
        this.errors = ''
    }

    edit() {
        this.hearingPartModificationService.updateListingRequest(this.listing, this.prepareNotes());
        this.openDialog('Editing listing request');

        this.onSave.emit();
    }

    create() {
        this.listing.hearingPart.id = uuid();

        this.hearingPartModificationService.createListingRequest(this.listing, this.prepareNotes());
        this.openDialog('Creating listing request');
    }

    createNotes() {
        this.store.dispatch(new fromNotes.CreateMany(this.prepareNotes()));
    }

    prepareNotes() {
        return this.notePreparerService.prepare(
            this.noteList.getModifiedNotes(),
            this.listing.hearingPart.id,
            this.listingNotesConfig.entityName
        );
    }

    updateDuration(durationValue) {
        if (durationValue !== undefined && durationValue !== null) {
            this.listing.hearingPart.duration = moment.duration(durationValue, 'minute');
        }
    }

    validateTargetDates(control: AbstractControl): { [key: string]: boolean } {
        const targetFrom = control.get('targetFrom').value as moment.Moment;
        const targetTo = control.get('targetTo').value as moment.Moment;

        function isLogicallyUndefined(property: any) {
            return (property === undefined) || (property === '') || (property === null) || property.isValid() === false;
        }

        if (isLogicallyUndefined(targetFrom) || isLogicallyUndefined(targetTo)) {
            return null;
        }

        return targetFrom.isSameOrBefore(targetTo) ? null : {targetFromAfterTargetTo: true};
    }

    onCaseTypeChanged(event: MatSelectChange) {
        this.listing.hearingPart.hearingType = undefined;
        let newHearings = [];

        if (!(event.value === undefined || event.value === null)) {
            const selectedCode = event.value as string;
            newHearings = this.getHearingTypesFromCaseType(selectedCode);
        }
        this.hearings = newHearings;
    }

    private setNotesIfExist(hp: ListingCreate) {
        return this.listingNotesConfig.defaultNotes().map(note => {
            const obj = hp.notes.find(note1 => note1.type === note.type);
            return obj || note
        });
    }

    private initiateListing() {
        this.listing = this.defaultListing();
    }

    private getHearingTypesFromCaseType(selectedCaseTypeCode): HearingType[] {
        return this.caseTypes.find(ct => ct.code === selectedCaseTypeCode).hearingTypes;
    }

    private defaultListing(): ListingCreate {
        return {
            hearingPart: {
                id: undefined,
                session: undefined,
                caseNumber: undefined,
                caseTitle: undefined,
                caseType: undefined,
                hearingType: undefined,
                duration: undefined,
                scheduleStart: undefined,
                scheduleEnd: undefined,
                priority: Priority.Low,
                version: 0,
                reservedJudgeId: undefined,
                communicationFacilitator: undefined,
                userTransactionId: undefined,
            },
            notes: this.listingNotesConfig.defaultNotes(),
            userTransactionId: undefined
        };
    }

    private setFormGroup() {
        this.listingCreate = new FormGroup({
            caseNumber: new FormControl(
                this.listing.hearingPart.caseNumber,
                [Validators.required, Validators.maxLength(this.caseNumberMaxLength)]
            ),
            caseTitle: new FormControl(
                this.listing.hearingPart.caseTitle,
                [Validators.required, Validators.maxLength(this.caseTitleMaxLength)]
            ),
            caseType: new FormControl(
                this.listing.hearingPart.caseType,
                [Validators.required]
            ),
            hearingType: new FormControl(
                this.listing.hearingPart.hearingType,
                [Validators.required]
            ),
            duration: new FormControl(
                this.listing.hearingPart.duration ? this.listing.hearingPart.duration.asMinutes() : undefined,
                [Validators.required, Validators.min(1)]
            ),
            targetDates: new FormGroup({
                targetFrom: new FormControl(this.listing.hearingPart.scheduleStart),
                targetTo: new FormControl(this.listing.hearingPart.scheduleEnd),
            }, this.validateTargetDates)
        });
    }

    private openDialog(actionTitle: string) {
        this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            data: { actionTitle },
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true
        }).afterClosed().subscribe((confirmed) => {
            this.afterClosed(confirmed);
        });
    }

    afterClosed(confirmed) {
        if (confirmed) {
            this.createNotes();
        }
        if (this.editMode) {
            this.afterEdit();
        }
    }

    afterEdit() {
        this.store.dispatch(new GetById(this.listing.hearingPart.id));
    }
}

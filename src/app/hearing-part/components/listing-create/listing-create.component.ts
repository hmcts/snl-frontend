import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate } from '../../models/listing-create';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { getHearingPartsError } from '../../reducers';
import { GetById } from '../../actions/hearing.action';
import { Priority } from '../../models/priority-model';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import * as JudgeActions from '../../../judges/actions/judge.action';
import { Judge } from '../../../judges/models/judge.model';
import * as fromJudges from '../../../judges/reducers';
import { HearingModificationService } from '../../services/hearing-modification.service';
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
import { ListingNoteListComponent } from '../listing-note-list/listing-note-list.component';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';

@Component({
    selector: 'app-listing-create',
    templateUrl: './listing-create.component.html',
    styleUrls: ['./listing-create.component.scss']
})
export class ListingCreateComponent implements OnInit {
    @ViewChild('listingCreateForm') listingFormGroup: FormGroupDirective;
    @ViewChild('notesComponent') notesComponent: ListingNoteListComponent;

    @Input() set data(value: ListingCreate) {
        this.listing = value;
        this.setFormGroup();
    }

    @Input() editMode = false;

    @Output() onSave = new EventEmitter();

    listingCreate: FormGroup;
    communicationFacilitators = ['Sign Language', 'Interpreter', 'Digital Assistance', 'Custom'];
    errors = '';
    priorityValues = Object.values(Priority);
    judges: Judge[] = [];
    hearings: HearingType[] = [];
    noteViewModels: NoteViewmodel[] = [];
    listingTypeSelection = new FormControl();
    public listing: ListingCreate;

    private _caseTypes: CaseType[] = [];
    get caseTypes(): CaseType[] {
        return this._caseTypes;
    }

    set caseTypes(caseTypes: CaseType[]) {
        this._caseTypes = caseTypes;
        const caseTypeCode = safe(() => this.listing.hearing.caseTypeCode);

        if (caseTypeCode) {
            this.hearings = this.getHearingTypesFromCaseType(caseTypeCode);
        }
    }

    caseTitleMaxLength = 200;
    caseNumberMaxLength = 200;
    numberOfSeconds = 60;
    binIntMaxValue = 9223372036854775807;
    limitMaxValue = this.binIntMaxValue / this.numberOfSeconds;

    constructor(private readonly store: Store<State>,
                public dialog: MatDialog,
                private readonly hearingPartModificationService: HearingModificationService) {

        this.store.select(getHearingPartsError).subscribe((error: any) => {
            this.errors = safe(() => error.message);
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
        this.prepareListingTypeData();
        if (this.editMode) {
            this.edit();
        } else {
            this.create();
        }
        this.errors = '';
    }

    edit() {
        this.hearingPartModificationService.updateListingRequest(this.listing);
        this.openDialog('Editing listing request');

        this.onSave.emit();
    }

    create() {
        this.listing.hearing.id = uuid();

        this.hearingPartModificationService.createListingRequest(this.listing);
        this.openDialog('Creating listing request');
    }

    createNotes() {
        this.store.dispatch(new fromNotes.CreateMany(this.notesComponent.prepareNotes()));
    }

    updateDuration(durationValue, unit) {
        if (durationValue !== undefined && durationValue !== null) {
            this.listing.hearing.duration = moment.duration(durationValue, unit);
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
        this.listing.hearing.hearingTypeCode = undefined;
        let newHearings = [];

        if (!(event.value === undefined || event.value === null)) {
            const selectedCode = event.value as string;
            newHearings = this.getHearingTypesFromCaseType(selectedCode);
        }
        this.hearings = newHearings;
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
        this.store.dispatch(new GetById(this.listing.hearing.id));
    }

    private initiateListing() {
        this.listing = this.defaultListing();
    }

    private getHearingTypesFromCaseType(selectedCaseTypeCode): HearingType[] {
        return this.caseTypes.find(ct => ct.code === selectedCaseTypeCode).hearingTypes;
    }

    private defaultListing(): ListingCreate {
        return {
            hearing: {
                id: undefined,
                caseNumber: undefined,
                caseTitle: undefined,
                caseTypeCode: undefined,
                hearingTypeCode: undefined,
                duration: undefined,
                scheduleStart: undefined,
                scheduleEnd: undefined,
                priority: Priority.Low,
                version: 0,
                reservedJudgeId: undefined,
                communicationFacilitator: undefined,
                userTransactionId: undefined,
                numberOfSessions: 1
            },
            notes: []
        };
    }

    private setFormGroup() {
        this.listingCreate = new FormGroup({
            caseNumber: new FormControl(
                this.listing.hearing.caseNumber,
                [Validators.required, Validators.maxLength(this.caseNumberMaxLength)]
            ),
            caseTitle: new FormControl(
                this.listing.hearing.caseTitle,
                [Validators.maxLength(this.caseTitleMaxLength)]
            ),
            caseTypeCode: new FormControl(
                this.listing.hearing.caseTypeCode,
                [Validators.required]
            ),
            hearingTypeCode: new FormControl(
                this.listing.hearing.hearingTypeCode,
                [Validators.required]
            ),
            listingType: new FormGroup({
                duration: new FormControl(
                    this.listing.hearing.duration ? this.listing.hearing.duration.asMinutes() : undefined,
                    [Validators.required, Validators.min(1), Validators.max(this.limitMaxValue)]
                ),
                numberOfSessions: new FormControl(
                    this.listing.hearing.numberOfSessions, [Validators.min(1)]
                )
            }),
            targetDates: new FormGroup({
                targetFrom: new FormControl(this.listing.hearing.scheduleStart),
                targetTo: new FormControl(this.listing.hearing.scheduleEnd),
            }, this.validateTargetDates)
        });
    }

    private openDialog(actionTitle: string) {
        this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...TransactionDialogComponent.DEFAULT_DIALOG_CONFIG,
            data: { actionTitle }
        }).afterClosed().subscribe((confirmed) => {
            this.afterClosed(confirmed);
        });
    }

    private prepareListingTypeData() {
        switch (this.listingTypeSelection.value) {
            case ListingTypeTab.Single:
                this.listing.hearing.numberOfSessions = 1;
                break;
            case ListingTypeTab.Multi:
                this.listing.hearing.duration = moment.duration(Math.ceil(this.listing.hearing.duration.asDays()), 'days');
                break;
        }
    }
}

export enum ListingTypeTab {
    Single = 0,
    Multi = 1,
}

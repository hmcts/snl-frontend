import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate, isMultiSessionListing } from '../../models/listing-create';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { GetById } from '../../actions/hearing.action';
import { Priority } from '../../models/priority-model';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import * as JudgeActions from '../../../judges/actions/judge.action';
import { Judge } from '../../../judges/models/judge.model';
import * as fromJudges from '../../../judges/reducers';
import { HearingModificationService } from '../../services/hearing-modification.service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog, MatRadioChange, MatSelectChange } from '@angular/material';
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
import { CommunicationFacilitators } from '../../models/communication-facilitators.model';
import { DurationAsDaysPipe } from '../../../core/pipes/duration-as-days.pipe';

export enum ListingTypeTab {
    Single = 0,
    Multi = 1,
}

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
    communicationFacilitators = Object.values(CommunicationFacilitators);
    errors = '';
    priorityValues = Object.values(Priority);
    judges: Judge[] = [];
    hearings: HearingType[] = [];
    noteViewModels: NoteViewmodel[] = [];

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

    public chosenListingType = 0;
    public listing: ListingCreate;
    public listingType = ListingTypeTab;
    caseTitleMaxLength = 200;
    caseNumberMaxLength = 200;
    numberOfSeconds = 60;
    binIntMaxValue = 86399; // 24h * 60m * 60s -1s
    limitMaxValue = this.binIntMaxValue / this.numberOfSeconds;
    private asDaysPipe = new DurationAsDaysPipe();

    constructor(private readonly store: Store<State>,
                public dialog: MatDialog,
                private readonly hearingPartModificationService: HearingModificationService) {

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
        this.chosenListingType = ListingTypeTab.Single;
        if (this.editMode) {
            if (this.listing.hearing.duration.asHours() >= 24) {
                this.chosenListingType = ListingTypeTab.Multi;
            }
        }
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

    onListingTypeChange(event: MatRadioChange) {
        this.chosenListingType = Number.parseInt(event.value);
    }

    isMultiSession(): boolean {
        return isMultiSessionListing(this.listing);
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
            listingTypeRadio: new FormControl(
                this.chosenListingType, [Validators.required]
            ),
            listingType: new FormGroup({
                duration: new FormControl({
                        value: this.getDurationToDisplay(),
                        disabled: this.editMode && this.isMultiSession()
                    },
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

    private getDurationToDisplay() {
        if (this.listing.hearing.duration) {
            if (this.chosenListingType === ListingTypeTab.Multi) {
                return this.asDaysPipe.transform(this.listing.hearing.duration);
            } else {
                return this.listing.hearing.duration.asMinutes();
            }
        }
        return undefined;
    }

    private openDialog(actionTitle: string) {
        this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...TransactionDialogComponent.DEFAULT_DIALOG_CONFIG,
            data: {actionTitle}
        }).afterClosed().subscribe((confirmed) => {
            this.afterClosed(confirmed);
        });
    }

    private prepareListingTypeData() {
        switch (this.chosenListingType) {
            case ListingTypeTab.Multi:
                // Crazy conversions as otherwise value of 1.5day is send as P1.5D instead of P1DT12H
                this.listing.hearing.duration = moment.duration(
                    moment.duration(this.asDaysPipe.transform(this.listing.hearing.duration), 'days').asMinutes()
                    , 'minutes');
                break;
            case ListingTypeTab.Single:
            default:
                if (safe(() => this.listing.hearing.duration.asHours() >= 24)) {
                    this.listing.hearing.duration = moment.duration(24 * 60 - 1, 'minutes');
                }
                this.listing.hearing.numberOfSessions = 1;
                break;
        }
    }
}

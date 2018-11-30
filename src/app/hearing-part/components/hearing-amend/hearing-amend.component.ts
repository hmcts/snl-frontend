import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Priority } from '../../models/priority-model';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Judge } from '../../../judges/models/judge.model';
import { MatRadioChange, MatSelectChange } from '@angular/material';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/combineLatest';
import { safe } from '../../../utils/js-extensions';
import { ListingNoteListComponent } from '../listing-note-list/listing-note-list.component';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { CommunicationFacilitators } from '../../models/communication-facilitators.model';
import { DurationAsDaysPipe } from '../../../core/pipes/duration-as-days.pipe';
import { HearingViewmodelForAmendment } from '../../models/filtered-hearing-viewmodel';
import { Status } from '../../../core/reference/models/status.model';

export enum ListingTypeTab {
    Single = 0,
    Multi = 1,
}

@Component({
    selector: 'app-hearing-amend',
    templateUrl: './hearing-amend.component.html',
    styleUrls: ['./hearing-amend.component.scss']
})
export class HearingAmendComponent {
    @ViewChild('listingCreateForm') listingFormGroup: FormGroupDirective;
    @ViewChild('notesComponent') notesComponent: ListingNoteListComponent;

    @Input() set data(value: HearingViewmodelForAmendment) {
        this.listing = value;

        if (this.listing.hearing.multiSession) {
            this.chosenListingType = ListingTypeTab.Multi;
        } else {
            this.chosenListingType = ListingTypeTab.Single
        }

        this.setFormGroup();

        this.limitSessionsMaxValue = this.listing.hearing.numberOfSessions;
    }

    @Output() onSave = new EventEmitter();
    @Input() judges: Judge[] = [];

    listingRequestFormGroup: FormGroup;
    communicationFacilitators = Object.values(CommunicationFacilitators);
    priorityValues = Object.values(Priority);
    hearings: HearingType[] = [];
    noteViewModels: NoteViewmodel[] = [];

    private _caseTypes: CaseType[] = [];
    get caseTypes(): CaseType[] {
        return this._caseTypes;
    }

    @Input() set caseTypes(caseTypes: CaseType[]) {
        this._caseTypes = caseTypes;
        const caseTypeCode = safe(() => this.listing.hearing.caseTypeCode);

        if (caseTypeCode) {
            this.hearings = this.getHearingTypesFromCaseType(caseTypeCode);
        }
    }

    public chosenListingType = 0;
    public listing: HearingViewmodelForAmendment;
    public listingType = ListingTypeTab;
    public caseTitleMaxLength = 200;
    public caseNumberMaxLength = 200;
    public numberOfSeconds = 60;
    public binIntMaxValue = 86399; // 24h * 60m * 60s -1s
    public limitMaxValue = this.binIntMaxValue / this.numberOfSeconds;
    public limitSessionsMaxValue: number;

    constructor(private readonly asDaysPipe: DurationAsDaysPipe) {}

    save() {
        this.prepareListingTypeData();

        this.onSave.emit({...this.listing, notes: this.notesComponent.prepareNotes()});
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

    onListingTypeChange(event: MatRadioChange) {
        this.chosenListingType = Number.parseInt(event.value);
    }

    isMultiSession(): boolean {
        return this.listing.hearing.multiSession;
    }

    parseDate(date) {
        return date ? moment(date).format('DD/MM/YYYY') : null;
    }

    isListed() {
        return this.listing.hearing.status === Status.Listed;
    }

    private getHearingTypesFromCaseType(selectedCaseTypeCode): HearingType[] {
        return this.caseTypes.find(ct => ct.code === selectedCaseTypeCode).hearingTypes;
    }

    private setFormGroup() {
        this.listingRequestFormGroup = new FormGroup({
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
                        value: this.getDurationToDisplay()
                    },
                    [Validators.required, Validators.min(1), Validators.max(this.limitMaxValue)]
                ),
                numberOfSessions: new FormControl(
                    this.listing.hearing.numberOfSessions, [
                        Validators.min(this.listing.hearing.multiSession ? 2 : 1),
                        Validators.max(this.listing.hearing.status === Status.Listed ? this.limitSessionsMaxValue : undefined)
                    ]
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

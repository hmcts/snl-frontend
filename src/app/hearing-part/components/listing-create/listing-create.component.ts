import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate } from '../../models/listing-create';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { getHearingPartsError } from '../../reducers';
import { CreateListingRequest } from '../../actions/hearing-part.action';
import { Priority } from '../../models/priority-model';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import * as JudgeActions from '../../../judges/actions/judge.action';
import { Judge } from '../../../judges/models/judge.model';
import * as fromJudges from '../../../judges/reducers';
import * as fromReferenceData from '../../../core/reference/reducers';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/combineLatest';
import { MatSelectChange } from '@angular/material';

const DURATION_UNIT = 'minute';

@Component({
    selector: 'app-listing-create',
    templateUrl: './listing-create.component.html',
    styleUrls: ['./listing-create.component.scss']
})
export class ListingCreateComponent implements OnInit {
    @ViewChild(NoteListComponent) noteList: NoteListComponent;

    listingCreate: FormGroup;
    hearings: HearingType[] = []
    communicationFacilitators = ['None', 'Sign Language', 'Interpreter', 'Digital Assistance', 'Custom'];
    errors = '';
    success: boolean;
    priorityValues = Object.values(Priority);
    judges: Judge[] = [];
    caseTypes: CaseType[] = [];

    public listing: ListingCreate;

    constructor(private readonly store: Store<State>,
                private readonly notePreparerService: NotesPreparerService,
                private readonly listingNotesConfig: ListingCreateNotesConfiguration) {

        this.store.select(getHearingPartsError).subscribe((error: any) => {
            if (error !== undefined ) {
                this.errors = error.message;
            }
        });
        this.store.select(fromJudges.getJudges).withLatestFrom(
            this.store.select(fromReferenceData.selectCaseTypes)
            , (judges, caseTypes: CaseType[]) => {
                this.judges = Object.values(judges);
                this.caseTypes = caseTypes;
            }
        ).subscribe((data) => {
            this.initiateListing();
            this.initiateForm();
        });
    }

    ngOnInit() {
        this.store.dispatch(new JudgeActions.Get());
    }

    create() {
        this.listing.id = uuid();
        this.listing.notes = this.notePreparerService.prepare(
            this.noteList.getModifiedNotes(),
            this.listing.id,
            this.listingNotesConfig.entityName
        );

        this.store.dispatch(new CreateListingRequest(this.listing));
        this.initiateListing();
    }

    updateDuration(durationValue) {
        if (durationValue !== undefined && durationValue !== null) {
            this.listing.duration = moment.duration(durationValue, 'minute');
        }
    }

    targetDatesValidator(control: AbstractControl): { [key: string]: boolean } {
        const targetFrom = control.get('targetFrom').value as moment.Moment;
        const targetTo = control.get('targetTo').value as moment.Moment;

        if (targetFrom === null || targetTo === null) {
            return null;
        }

        return targetFrom.isSameOrBefore(targetTo) ? null : {targetFromAfterTargetTo: true};
    }

    onCaseTypeChanged(event: MatSelectChange) {
        let newHearings = []
        if ( event.value !== undefined ) {
            const selectedCode = event.value as string;
            newHearings = this.caseTypes.find(ct => ct.code === selectedCode).hearingTypes;
        }
        this.hearings = newHearings;
    }

    private initiateListing() {
        const now = moment();
        this.hearings = this.caseTypes[0].hearingTypes;
        this.listing = {
            id: undefined,
            caseNumber: `number-${now.toISOString()}`,
            caseTitle: `title-${now.toISOString()}`,
            caseType: this.caseTypes[0].code,
            hearingType: this.hearings[0].code,
            duration: moment.duration(30, DURATION_UNIT),
            scheduleStart: now,
            scheduleEnd: moment().add(30, 'day'),
            createdAt: now,
            notes: this.listingNotesConfig.defaultNotes(),
            priority: Priority.Low
        } as ListingCreate;
        this.errors = '';
        this.success = false;
    }

    private initiateForm() {
        this.listingCreate = new FormGroup({
            caseNumber: new FormControl(this.listing.caseNumber, Validators.required),
            caseTitle: new FormControl(this.listing.caseTitle, [Validators.required]),
            caseType: new FormControl(this.listing.caseType, [Validators.required]),
            hearingType: new FormControl(this.listing.hearingType, [Validators.required]),
            duration: new FormControl(this.listing.duration.asMinutes(), [Validators.required, Validators.min(1)]),
            createdAt: new FormControl(this.listing.createdAt),
            targetDates: new FormGroup({
                targetFrom: new FormControl(this.listing.scheduleStart),
                targetTo: new FormControl(this.listing.scheduleEnd),
            }, this.targetDatesValidator)
        });
    }
}

import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate } from '../../models/listing-create';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { CreateListingRequest } from '../../actions/hearing-part.action';
import { getHearingPartsError } from '../../reducers/index';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

const DURATION_UNIT = 'minute';

@Component({
    selector: 'app-listing-create',
    templateUrl: './listing-create.component.html',
    styleUrls: ['./listing-create.component.scss']
})
export class ListingCreateComponent {
    @ViewChild(NoteListComponent) noteList: NoteListComponent;

    listingCreate: FormGroup;

    hearings: string[] = ['Preliminary Hearing', 'Trial Hearing', 'Adjourned Hearing'];
    caseTypes: string[] = ['SCLAIMS', 'FTRACK', 'MTRACK'];
    errors = '';

    public listing: ListingCreate;

    constructor(private readonly store: Store<State>,
                private notePreparerService: NotesPreparerService,
                private listingNotesConfig: ListingCreateNotesConfiguration) {

        this.store.select(getHearingPartsError).subscribe((error: any) => {
            this.errors = error.message;
        });

        this.initiateListing();
        this.initiateForm();
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
            this.listing.duration = moment.duration(durationValue, 'minute')
        }
    }

    targetDatesValidator(control: AbstractControl): {[key: string]: boolean} {
        const targetFrom = control.get('targetFrom').value as moment.Moment;
        const targetTo = control.get('targetTo').value as moment.Moment;

        if (targetFrom === null || targetTo === null) {
            return null;
        }

        return targetFrom.isSameOrBefore(targetTo) ? null : { targetFromAfterTargetTo: true };
    }

    private initiateListing() {
        const now = moment();
        this.listing = {
            id: undefined,
            caseNumber: `number-${now.toISOString()}`,
            caseTitle: `title-${now.toISOString()}`,
            caseType: this.caseTypes[0],
            hearingType: this.hearings[0],
            duration: moment.duration(30, DURATION_UNIT),
            scheduleStart: now,
            scheduleEnd: moment().add(30, 'day'),
            createdAt: now,
            notes: this.listingNotesConfig.defaultNotes()
        } as ListingCreate;
        this.errors = '';
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
        })
    }
}

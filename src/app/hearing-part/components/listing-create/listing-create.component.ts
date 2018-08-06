import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate } from '../../models/listing-create';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { CreateFailed, CreateListingRequest } from '../../actions/hearing-part.action';
import { getHearingPartError } from '../../reducers/hearing-part.reducer';
import * as dateUtils from '../../../utils/date-utils';
import { Priority } from '../../models/priority-model';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';

const DURATION_UNIT = 'minute';

@Component({
    selector: 'app-listing-create',
    templateUrl: './listing-create.component.html',
    styleUrls: []
})
export class ListingCreateComponent {
    @ViewChild(NoteListComponent) noteList: NoteListComponent;

    hearings: string[];
    caseTypes: string[];
    duration = 0;
    errors = '';
    success: boolean;
    priorityValues = Object.values(Priority);

    public listing: ListingCreate;

    constructor(private readonly store: Store<State>,
                private notePreparerService: NotesPreparerService,
                private listingNotesConfig: ListingCreateNotesConfiguration) {
        this.hearings = ['Preliminary Hearing', 'Trial Hearing', 'Adjourned Hearing'];
        this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];
        this.initiateListing();
        this.store.select(getHearingPartError).subscribe(error => {
            this.errors = error;
        });
    }

    create() {
        this.listing.id = uuid();
        this.listing.notes = this.notePreparerService.prepare(this.noteList.getModifiedNotes(),
            this.listing.id,
            this.listingNotesConfig.entityName);

        this.listing.duration.add(this.duration, DURATION_UNIT);
        if (!dateUtils.isDateRangeValid(this.listing.scheduleStart, this.listing.scheduleEnd)) {
            this.store.dispatch(new CreateFailed('Start date should be before End date'));
            this.success = false;
        } else {
            this.store.dispatch(new CreateListingRequest(this.listing));
            this.initiateListing();
            this.success = true;
        }
    }

    private initiateListing() {
        const now = moment();
        this.listing = {
            id: undefined,
            caseNumber: `number-${now.toISOString()}`,
            caseTitle: `title-${now.toISOString()}`,
            caseType: this.caseTypes[0],
            hearingType: this.hearings[0],
            duration: moment.duration(),
            scheduleStart: now,
            scheduleEnd: moment().add(30, 'day'),
            createdAt: now,
            notes: this.listingNotesConfig.defaultNotes,
            priority: Priority.Low
        } as ListingCreate;
        this.duration = 30;
        this.errors = '';
        this.success = false;
    }
}

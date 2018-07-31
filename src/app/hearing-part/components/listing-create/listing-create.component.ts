import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate } from '../../models/listing-create';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { CreateListingRequest } from '../../actions/hearing-part.action';
import { getHearingPartError } from '../../reducers/hearing-part.reducer';
import * as dateUtils from '../../../utils/date-utils';
import { Note } from '../../../notes/models/note.model';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';

const DURATION_UNIT = 'minute';

@Component({
    selector: 'app-listing-create',
    templateUrl: './listing-create.component.html',
    styleUrls: ['./listing-create.component.scss']
})
export class ListingCreateComponent {
    @ViewChild(NoteListComponent) noteList: NoteListComponent;

    hearings: string[];
    caseTypes: string[];
    duration = 0;
    errors = '';
    success: boolean;

    public listing: ListingCreate;

    constructor(private readonly store: Store<State>) {
        this.hearings = ['Preliminary Hearing', 'Trial Hearing', 'Adjourned Hearing'];
        this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];
        this.initiateListing();
        this.store.select(getHearingPartError).subscribe(error => {
            this.errors = error;
        });
    }

    create() {
        this.listing.id = uuid();
        this.listing.notes = this.noteList.getModifiedOrNewNotes().map(this.generateUUIDIfUndefined);
        this.listing.duration.add(this.duration, DURATION_UNIT);
        if (!dateUtils.isDateRangeValid(this.listing.scheduleStart, this.listing.scheduleEnd)) {
            this.errors = 'Start date should be before End date';
        } else {
            this.store.dispatch(new CreateListingRequest(this.listing));
            this.initiateListing();
            this.success = true;
        }
    }

    private initiateListing() {
        let now = moment();
        this.listing = {
            id: undefined,
            caseNumber: `case-number-${now}`,
            caseTitle: `case-title-${now}`,
            caseType: this.caseTypes[0],
            hearingType: this.hearings[0],
            duration: moment.duration(30, DURATION_UNIT),
            scheduleStart: now,
            scheduleEnd: now,
            createdAt: now,
            notes: this.defaultListingNotes()
        } as ListingCreate;
        this.duration = 0;
        this.errors = '';
        this.success = false;
    }

    private defaultListingNotes(): Note[] {
        let specReqNote = {
            id: undefined,
            content: '',
            type: 'Special Requirements'
        } as Note

        let facReqNote = {
            id: undefined,
            content: '',
            type: 'Facility Requirements'
        } as Note

        let otherNote = {
            id: undefined,
            content: '',
            type: 'Other note'
        } as Note

        return [specReqNote, facReqNote, otherNote];
    }

    private generateUUIDIfUndefined(note: NoteViewmodel): NoteViewmodel {
        if ((note.id === undefined) || (note.id === '') || (note.id === null)) {
            note.id = uuid();
        }
        return note;
    }
}

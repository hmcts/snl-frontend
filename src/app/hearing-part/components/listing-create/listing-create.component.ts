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
    styleUrls: []
})
export class ListingCreateComponent {
    @ViewChild(NoteListComponent) noteList: NoteListComponent;

    hearings: string[];
    caseTypes: string[];
    duration = 0;
    errors = '';

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
        this.listing.notes = this.noteList.getModifiedNotes()
            .map(n => this.generateUUIDIfUndefined(n))
            .map(n => this.assignParentIdIfUndefined(n, this.listing.id));

        this.listing.duration.add(this.duration, DURATION_UNIT);
        if (!dateUtils.isDateRangeValid(this.listing.scheduleStart, this.listing.scheduleEnd)) {
            this.errors = 'Start date should be before End date';
        } else {
            this.store.dispatch(new CreateListingRequest(this.listing));
            this.initiateListing();
        }
    }

    private initiateListing() {
        let now = moment();
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
            notes: this.defaultListingNotes()
        } as ListingCreate;
        this.duration = 30;
        this.errors = '';
    }

    private defaultListingNotes(): Note[] {
        let specReqNote = {
            id: undefined,
            content: '',
            type: 'Special Requirements'
        } as Note;

        let facReqNote = {
            id: undefined,
            content: '',
            type: 'Facility Requirements'
        } as Note;

        let otherNote = {
            id: undefined,
            content: '',
            type: 'Other note'
        } as Note;

        return [specReqNote, facReqNote, otherNote];
    }

    private generateUUIDIfUndefined(note: Note): Note {
        if (this.isLogicallyUndefined(note.id)) {
            note.id = uuid();
        }
        return note;
    }

    private assignParentIdIfUndefined(note: Note, parentId: string): Note {
        if (this.isLogicallyUndefined(note.parentId)) {
            note.parentId = parentId;
        }
        return note;
    }

    private isLogicallyUndefined(property: any) {
        return (property === undefined) || (property === '') || (property === null)
    }
}

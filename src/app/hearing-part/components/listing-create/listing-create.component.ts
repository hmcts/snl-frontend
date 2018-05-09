import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate } from '../../models/listing-create';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';

const DURATION_UNIT = 'minute';

@Component({
    selector: 'app-listing-create',
    templateUrl: './listing-create.component.html',
    styleUrls: ['./listing-create.component.scss']
})
export class ListingCreateComponent implements OnInit {
    hearings: string[];
    caseTypes: string[];
    duration = 0;
    errors = '';

    listing: ListingCreate;

    constructor(private store: Store<State>) {
        this.hearings = ['Preliminary Hearing', 'Trial Hearing', 'Adjourned Hearing'];
        this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];
        this.initiateListing();
    }

    create() {
        this.listing.id = uuid();
        this.listing.duration.add(this.duration, DURATION_UNIT);
        if (this.checkRequiredFields(this.listing)) {
            if ((this.listing.scheduleStart === null && this.listing.scheduleEnd !== null)
                || (this.listing.scheduleStart !== null && this.listing.scheduleEnd === null)
                || (this.listing.scheduleStart !== null
                    && this.listing.scheduleEnd !== null
                    && this.listing.scheduleStart.getDate() > this.listing.scheduleEnd.getDate())
            ) {
                this.errors = 'Start date should be before End date';
            } else {
                // this.store.dispatch(new Action())

                this.initiateListing();
            }
        } else {
            this.errors = 'Required (*) field is missing value';
        }
    }

    ngOnInit() {
    }

    private initiateListing() {
        this.listing = {
            id: undefined,
            caseNumber: undefined,
            caseTitle: undefined,
            caseType: undefined,
            hearingType: undefined,
            duration: moment.duration(0, DURATION_UNIT),
            scheduleStart: null,
            scheduleEnd: null,
        } as ListingCreate;
        this.duration = 0;
        this.errors = '';
    }

    private checkRequiredFields(listing: ListingCreate) {
        if (listing.caseNumber === undefined || listing.caseNumber.trim() === '') {
            return false;
        }
        if (listing.caseTitle === undefined || listing.caseTitle.trim() === '') {
            return false;
        }
        if (listing.caseType === undefined || listing.caseType.trim() === '') {
            return false;
        }
        if (listing.hearingType === undefined || listing.hearingType.trim() === '') {
            return false;
        }
        if (listing.duration === undefined || listing.duration.get(DURATION_UNIT) === 0) {
            return false;
        }
        return true;
    }
}

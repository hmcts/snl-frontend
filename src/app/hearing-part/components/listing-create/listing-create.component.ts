import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate } from '../../models/listing-create';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { Create, CreateListingRequest } from '../../actions/hearing-part.action';
import { getHearingPartError } from '../../reducers/hearing-part.reducer';
import * as dateUtils from '../../../utils/date-utils';

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
    success: boolean;

    listing: ListingCreate;

    constructor(private store: Store<State>) {
        this.hearings = ['Preliminary Hearing', 'Trial Hearing', 'Adjourned Hearing'];
        this.caseTypes = ['SCLAIMS', 'FTRACK', 'MTRACK'];
        this.initiateListing();
        this.store.select(getHearingPartError).subscribe(error => {
            this.errors = error;
        });
    }

    create() {
        this.listing.id = uuid();
        this.listing.duration.add(this.duration, DURATION_UNIT);
        if (this.checkRequiredFields(this.listing)) {
            if (dateUtils.isDateRangeValid(this.listing.scheduleStart, this.listing.scheduleEnd)) {
                this.errors = 'Start date should be before End date';
            } else {
                this.store.dispatch(new CreateListingRequest(this.listing));
                this.initiateListing();
                this.success = true;
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
        this.success = false;
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
        if (listing.duration === undefined || listing.duration <= moment.duration(0)) {
            return false;
        }
        return true;
    }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { DEFAULT_HEARING_FILTERS, HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { Priority } from '../../models/priority-model';
import { ListingStatus } from '../../models/listing-status-model';
import { CommunicationFacilitators } from '../../models/communication-facilitators.model';

@Component({
    selector: 'app-hearings-filter',
    templateUrl: './hearings-filter.component.html',
    styleUrls: ['./hearings-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingsFilterComponent {
    @Output() onFilter = new EventEmitter();

    @Input() set filterValues(filterValues: HearingsFilters) {
        this.filters = filterValues || DEFAULT_HEARING_FILTERS;
        this.sendFilter();
    }
    @Input() judges: Judge[];
    @Input() caseTypes: CaseType[];
    @Input() hearingTypes: HearingType[];

    caseTitleMaxLength = 200;
    caseNumberMaxLength = 200;
    priorities = Object.keys(Priority);
    listingStatuses = {
        all: {
            value: ListingStatus.All,
            label: 'All'
        } ,
        listed: {
            value: ListingStatus.Listed,
            label: 'Listed'
        } ,
        unlisted: {
            value: ListingStatus.Unlisted,
            label: 'Unlisted'
        } ,
    };
    communicationFacilitators = Object.values(CommunicationFacilitators);
    filters: HearingsFilters = DEFAULT_HEARING_FILTERS;

    constructor() {}

    sendFilter() {
        this.onFilter.emit(this.filters);
    }
}

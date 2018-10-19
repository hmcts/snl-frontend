import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { DEFAULT_HEARING_FILTERS, HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { Priority } from '../../models/priority-model';

@Component({
    selector: 'app-hearings-filter',
    templateUrl: './hearings-filter.component.html',
    styleUrls: ['./hearings-filter.component.scss']
})
export class HearingsFilterComponent {
    @Output() onFilter = new EventEmitter();

    @Input() judges: Judge[];
    @Input() caseTypes: CaseType[];
    @Input() hearingTypes: HearingType[];

    priorities = Object.keys(Priority);
    communicationFacilitators = ['Sign Language', 'Interpreter', 'Digital Assistance', 'Custom'];
    filters: HearingsFilters = DEFAULT_HEARING_FILTERS;

    constructor() {}

    sendFilter() {
        this.onFilter.emit(this.filters);
    }
}

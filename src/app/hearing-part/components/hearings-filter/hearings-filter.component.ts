import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class HearingsFilterComponent implements OnInit {
    @Output() onFilter = new EventEmitter();

    @Input() judges: Judge[];
    @Input() caseTypes: CaseType[];
    @Input() hearingTypes: HearingType[];

    priorities = Object.keys(Priority);
    communicationFacilitators = ['Sign Language', 'Interpreter', 'Digital Assistance', 'Custom'];
    filters: HearingsFilters;

    constructor() {}

    ngOnInit() {
        this.filters = DEFAULT_HEARING_FILTERS;
    }

    sendFilter() {
        this.onFilter.emit(this.filters);
    }
}

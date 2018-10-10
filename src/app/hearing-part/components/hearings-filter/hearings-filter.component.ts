import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Judge } from '../../../judges/models/judge.model';
import { HearingsFilters } from '../../models/hearings-filter.model';
import * as moment from 'moment'
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';

@Component({
  selector: 'app-hearings-filter',
  templateUrl: './hearings-filter.component.html',
  styleUrls: ['./hearings-filter.component.scss']
})
export class HearingsFilterComponent implements OnInit {

  @Output() filter = new EventEmitter();

  @Input() judges: Judge[];
  @Input() caseTypes: CaseType[];
  @Input() hearingTypes: HearingType[];
  @Input() startDate: moment.Moment;
  @Input() endDate: moment.Moment;

  judgesPlaceholder: string;
  filters: HearingsFilters;

  constructor() {
      this.judgesPlaceholder = 'Select the judge';
  }

  ngOnInit() {
      this.filters = {
          hearingTypes: [],
          caseTypes: [],
          judges: [],
          startDate: this.startDate,
          endDate: this.endDate,
          utilization: {
              unlisted: {
                  active: false,
                  from: 0,
                  to: 0
              },
              partListed: {
                  active: false,
                  from: 1,
                  to: 99
              },
              fullyListed: {
                  active: false,
                  from: 100,
                  to: 100
              },
              overListed: {
                  active: false,
                  from: 101,
                  to: Infinity
              },
              custom: {
                  active: false,
                  from: 0,
                  to: 0
              }
          }
      } as HearingsFilters;

      this.sendFilter();
  }

  sendFilter() {
    this.filter.emit(this.filters);
  }
}

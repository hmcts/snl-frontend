import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ReportService } from '../services/report-service';
import { UnlistedHearingRequest } from '../model/unlisted-hearing-request';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-reports-container',
  templateUrl: './reports-container.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsContainerComponent implements OnInit {

    data: Observable<UnlistedHearingRequest[]>;

    constructor(public reportService: ReportService) {
    }

    ngOnInit() {
        this.getData('');
    }

    getData(event) {
        this.data = this.reportService.getUnlistedHearingRequests();
    }
}

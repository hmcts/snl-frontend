import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ReportService } from '../../../services/report-service';
import { UnlistedHearingRequest } from '../../../model/unlisted-hearings/unlisted-hearing-request';

@Component({
  selector: 'app-unlisted-hearing-requests',
  templateUrl: './unlisted-hearing-requests.component.html',
  styleUrls: []
})
export class UnlistedHearingRequestsComponent implements OnChanges {

    dataSource: MatTableDataSource<any>;
    displayedColumns = ['title', 'hearings', 'minutes'];

    constructor(public reportService: ReportService) {
        this.loadData();
    }

    ngOnChanges() {
        this.loadData();
    }

    loadData() {
        this.reportService.getUnlistedHearingRequests().subscribe(data => this._generateTableData(data, this));
    }

    private _generateTableData(unlistedHearingRequests: UnlistedHearingRequest[], context) {
        let totalHearings = 0;
        let totalMinutes = 0;

        unlistedHearingRequests.forEach(uhr => {totalHearings += uhr.hearings; totalMinutes += uhr.minutes});

        unlistedHearingRequests.push({title: 'Total', hearings: totalHearings, minutes: totalMinutes});
        context.dataSource = new MatTableDataSource(unlistedHearingRequests)
    }

}

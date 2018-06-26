import { Component, OnChanges} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ReportService } from '../../../services/report-service';
import { UnlistedHearingRequest } from '../../../model/unlisted-hearings/unlisted-hearing-request';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-unlisted-hearing-requests',
  templateUrl: './unlisted-hearing-requests.component.html',
  styleUrls: []
})
export class UnlistedHearingRequestsComponent implements OnChanges {

    dataSource: Observable<MatTableDataSource<any>>;
    displayedColumns = ['title', 'hearings', 'minutes'];

    constructor(public reportService: ReportService) {
        this.loadData();
    }

    ngOnChanges() {
        this.loadData();
    }

    loadData() {
        this.dataSource = this.reportService.getUnlistedHearingRequests().map(data => this._generateTableData(data));
    }

    private _generateTableData(unlistedHearingRequests: UnlistedHearingRequest[]) {
        let totalHearings = 0;
        let totalMinutes = 0;

        unlistedHearingRequests.forEach(uhr => {totalHearings += uhr.hearings; totalMinutes += uhr.minutes});

        unlistedHearingRequests.push({title: 'Total', hearings: totalHearings, minutes: totalMinutes});
        return new MatTableDataSource(unlistedHearingRequests)
    }

}

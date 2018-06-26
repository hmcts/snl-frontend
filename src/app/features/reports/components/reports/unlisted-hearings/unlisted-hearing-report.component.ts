import { MatTableDataSource } from '@angular/material';
import { ReportService } from '../../../services/report-service';
import { UnlistedHearingReportEntry } from '../../../model/unlisted-hearing-report-entry';
import { Observable } from 'rxjs/Observable';
import { Component, OnChanges } from '@angular/core';

@Component({
  selector: 'app-unlisted-hearing-report',
  templateUrl: './unlisted-hearing-report.component.html',
  styleUrls: []
})
export class UnlistedHearingReportComponent implements OnChanges {

    dataSource: Observable<MatTableDataSource<any>>;
    displayedColumns = ['title', 'hearings', 'minutes'];

    constructor(public reportService: ReportService) {
        this.loadData();
    }

    ngOnChanges() {
        this.loadData();
    }

    loadData() {
        this.dataSource = this.reportService.getUnlistedHearingRequests().map(this._generateTableData);
    }

    private _generateTableData = (unlistedHearingReportEntries: UnlistedHearingReportEntry[]) => {
        let totalHearings = 0;
        let totalMinutes = 0;

        unlistedHearingReportEntries.forEach(uhr => {totalHearings += uhr.hearings; totalMinutes += uhr.minutes});

        unlistedHearingReportEntries.push({title: 'Total', hearings: totalHearings, minutes: totalMinutes});
        return new MatTableDataSource(unlistedHearingReportEntries)
    }

}

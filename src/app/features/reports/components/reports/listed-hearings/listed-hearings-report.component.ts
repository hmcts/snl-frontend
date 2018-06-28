import { Component } from '@angular/core';
import { ReportService } from '../../../services/report-service';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-listed-hearings-report',
  templateUrl: './listed-hearings-report.component.html',
  styleUrls: []
})
export class ListedHearingsReportComponent {
    from: Date;
    to: Date;

    dataSource: Observable<MatTableDataSource<any>>;
    displayedColumns = ['caseId', 'caseName', 'judge', 'hearingType', 'caseType', 'duration',
        'startDate', 'startTime', 'room'];

    constructor(public reportService: ReportService) {
    }

    loadData() {
        this.dataSource = this.reportService.getListedHearingRequests(this.from, this.to)
            .map(data => new MatTableDataSource(data));
    }
}

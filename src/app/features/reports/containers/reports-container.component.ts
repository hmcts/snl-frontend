import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reports } from '../model/Reports';

@Component({
  selector: 'app-reports-container',
  templateUrl: './reports-container.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsContainerComponent {

    chosenReport: Reports;
    reports: any;

    constructor() {
        this.reports = Reports;
    }

    chooseReport(report: Reports) {
        this.chosenReport = report;
    }
}

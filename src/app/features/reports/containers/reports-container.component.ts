import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Reports } from '../model/Reports';

@Component({
  selector: 'app-reports-container',
  templateUrl: './reports-container.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsContainerComponent {

    chosenReport: string;
    reports: any;
    reportNames: string[];

    constructor() {
        this.reports = Reports;

        this.reportNames = Object.values(this.reports);
        this.chosenReport = '';
    }

    chooseReport(report) {
        this.chosenReport = report;
    }
}

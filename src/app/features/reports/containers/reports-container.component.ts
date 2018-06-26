import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports-container',
  templateUrl: './reports-container.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsContainerComponent {

    chosenReport: string;
    reportNames: string[];

    constructor() {
        this.reportNames = ['Unlisted hearings'];
        this.chosenReport = '';
    }

    chooseReport(report) {
        this.chosenReport = report;
    }
}

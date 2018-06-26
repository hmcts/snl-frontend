import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UnlistedHearingRequest } from '../model/unlisted-hearings/unlisted-hearing-request';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-reports-container',
  templateUrl: './reports-container.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsContainerComponent {

    chosenReport: string;
    reportNames: string[];
    data: Observable<UnlistedHearingRequest[]>;

    constructor() {
        this.reportNames = ['Unlisted hearings'];
        this.chosenReport = '';
    }

    chooseReport(report) {
        this.chosenReport = report;
    }
}

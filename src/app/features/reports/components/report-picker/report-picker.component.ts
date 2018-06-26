import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Reports } from '../../model/Reports';

@Component({
  selector: 'app-report-picker',
  templateUrl: './report-picker.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportPickerComponent {
    @Input() reports: Reports[];
    @Output() chooseReport = new EventEmitter();

    private getReportValues() {
        return Object.values(this.reports);
    }
}

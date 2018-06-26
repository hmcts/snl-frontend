import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-report-picker',
  templateUrl: './report-picker.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportPickerComponent {
    @Input() reportNames: string[];
    @Output() chooseReport = new EventEmitter();
}

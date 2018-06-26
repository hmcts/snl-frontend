import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnlistedHearingReportComponent } from './components/reports/unlisted-hearings/unlisted-hearing-report.component';
import { ReportsContainerComponent } from './containers/reports-container.component';
import { ReportPickerComponent } from './components/report-picker/report-picker.component';
import { ReportService } from './services/report-service';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { ListedHearingsReportComponent } from './components/reports/listed-hearings/listed-hearings-report.component';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';

const COMPONENTS = [
    UnlistedHearingReportComponent,
    ReportsContainerComponent,
    ReportPickerComponent,
    ListedHearingsReportComponent
]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
      CoreModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [ReportService]
})
export class ReportModule { }

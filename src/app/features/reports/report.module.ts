import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnlistedHearingRequestsComponent } from './components/reports/unlisted-hearings/unlisted-hearing-requests.component';
import { ReportsContainerComponent } from './containers/reports-container.component';
import { ReportPickerComponent } from './components/report-picker/report-picker.component';
import { ReportService } from './services/report-service';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';

const COMPONENTS = [
    UnlistedHearingRequestsComponent,
    ReportsContainerComponent,
    ReportPickerComponent
]
@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [ReportService]
})
export class ReportModule { }

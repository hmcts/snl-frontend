import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnlistedHearingReportComponent } from './components/reports/unlisted-hearings/unlisted-hearing-report.component';
import { ReportService } from './services/report-service';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { ListedHearingsReportComponent } from './components/reports/listed-hearings/listed-hearings-report.component';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { RouterModule } from '@angular/router';

const COMPONENTS = [
    UnlistedHearingReportComponent,
    ListedHearingsReportComponent
]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    CoreModule,
    RouterModule.forChild([{
      path: '',
      children: [
          {
              path: 'listed',
              component: ListedHearingsReportComponent
          }, {
              path: 'unlisted',
              component: UnlistedHearingReportComponent
          }
      ]},
    ])
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [ReportService]
})
export class ReportModule { }

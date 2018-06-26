import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarContainerComponent } from './callendar/containers/calendar-container.component';
import { CalendarComponent } from './callendar/components/calendar.component';
import { DurationAsMinutesPipe } from './pipes/duration-as-minutes.pipe';
import { TransactionBackendService } from './services/transaction-backend.service';
import { FullCalendarModule } from '../common/ng-fullcalendar/module';
import { ReportService } from '../features/reports/services/report-service';
import { UnlistedHearingRequestsComponent } from '../features/reports/components/reports/unlisted-hearings/unlisted-hearing-requests.component';
import { ReportsContainerComponent } from '../features/reports/containers/reports-container.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ReportPickerComponent } from '../features/reports/components/report-picker/report-picker.component';

export const COMPONENTS = [
    CalendarContainerComponent,
    CalendarComponent,
    DurationAsMinutesPipe,
    UnlistedHearingRequestsComponent,
    ReportsContainerComponent,
    ReportPickerComponent
];

@NgModule({
    imports: [
        CommonModule,
        FullCalendarModule,
        AngularMaterialModule
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    providers: [TransactionBackendService, ReportService]
})
export class CoreModule {
}

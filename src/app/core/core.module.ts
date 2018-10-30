import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarContainerComponent } from './callendar/containers/calendar-container.component';
import { CalendarComponent } from './callendar/components/calendar.component';
import { DurationFormatPipe } from './pipes/duration-format.pipe';
import { TransactionBackendService } from '../features/transactions/services/transaction-backend.service';
import { FullCalendarModule } from '../common/ng-fullcalendar/module';
import { ReferenceDataModule } from './reference/reference-data.module';
import { DurationAsMinutesPipe } from './pipes/duration-as-minutes.pipe';
import { DurationAsDaysPipe } from './pipes/duration-as-days.pipe';
import { HmctsModule } from '../hmcts/hmcts.module';

export const COMPONENTS = [
    CalendarContainerComponent,
    CalendarComponent,
    DurationFormatPipe,
    DurationAsMinutesPipe,
    DurationAsDaysPipe,
];

@NgModule({
    imports: [
        CommonModule,
        FullCalendarModule,
        ReferenceDataModule,
        HmctsModule
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    providers: [TransactionBackendService]
})
export class CoreModule {
}

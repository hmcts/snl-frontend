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
import { BaseResolver } from './resolvers/base.resolver';
import { MomentFormatPipe } from './pipes/moment-format.pipe';

export const COMPONENTS = [
    CalendarContainerComponent,
    CalendarComponent,
    DurationFormatPipe,
    DurationAsMinutesPipe,
    DurationAsDaysPipe,
    MomentFormatPipe
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
    providers: [TransactionBackendService, DurationAsDaysPipe, BaseResolver]
})
export class CoreModule {
}

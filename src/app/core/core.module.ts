import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarContainerComponent } from './callendar/containers/calendar-container.component';
import { CalendarComponent } from './callendar/components/calendar.component';
import { DurationFormatPipe } from './pipes/duration-format.pipe';
import { TransactionBackendService } from './services/transaction-backend.service';
import { FullCalendarModule } from '../common/ng-fullcalendar/module';
import { ReferenceDataModule } from './reference/reference-data.module';
import { DurationAsMinutesPipe } from './pipes/duration-as-minutes.pipe';

export const COMPONENTS = [
    CalendarContainerComponent,
    CalendarComponent,
    DurationFormatPipe,
    DurationAsMinutesPipe
];

@NgModule({
    imports: [
        CommonModule,
        FullCalendarModule,
        ReferenceDataModule
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    providers: [TransactionBackendService]
})
export class CoreModule {
}

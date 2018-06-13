import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarContainerComponent } from './callendar/containers/calendar-container.component';
import { CallendarComponent } from './callendar/components/callendar.component';
import { DurationAsMinutesPipe } from './pipes/duration-as-minutes.pipe';
import { TransactionBackendService } from './services/transaction-backend.service';
import { FullCalendarModule } from '../common/ng-fullcalendar/module';

export const COMPONENTS = [
    CalendarContainerComponent,
    CallendarComponent,
    DurationAsMinutesPipe
];

@NgModule({
    imports: [
        CommonModule,
        FullCalendarModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    providers: [TransactionBackendService]
})
export class CoreModule {
}

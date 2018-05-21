import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarContainerComponent } from './callendar/containers/calendar-container.component';
import { CallendarComponent } from './callendar/components/callendar.component';
import { FullCalendarModule } from '../common/ng-fullcalendar/module';

export const COMPONENTS = [
    CalendarContainerComponent,
    CallendarComponent
];

@NgModule({
    imports: [
        CommonModule,
        FullCalendarModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    providers: []
})
export class CoreModule {
}

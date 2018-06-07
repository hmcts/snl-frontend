import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityModule } from '../security/security.module';
import { PlannerComponent } from './components/planner.component';
import { NgFullcalendarSchedulerModule } from '../common/ng-fullcalendar-scheduler/ng-fullcalendar-scheduler.module';
import { CoreModule } from '../core/core.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatButtonModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        SecurityModule,
        NgFullcalendarSchedulerModule,
        CoreModule,
        AngularMaterialModule,
        MatButtonModule
    ],
    declarations: [PlannerComponent],
    providers: []
})
export class PlannerModule {
}

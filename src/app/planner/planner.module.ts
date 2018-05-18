import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityModule } from '../security/security.module';
import { PlannerComponent } from './components/planner.component';
import { NgFullcalendarSchedulerModule } from '../common/ng-fullcalendar-scheduler/ng-fullcalendar-scheduler.module';
// import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    SecurityModule,
    NgFullcalendarSchedulerModule
    // StoreModule.forFeature('planner', reducers),
    // EffectsModule.forFeature([JudgeEffects])
  ],
  declarations: [PlannerComponent],
  providers: []
})
export class PlannerModule {
}

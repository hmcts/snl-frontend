import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityModule } from '../security/security.module';
import { PlannerComponent } from './components/planner.component';
import { NgFullcalendarSchedulerModule } from '../common/ng-fullcalendar-scheduler/ng-fullcalendar-scheduler.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../sessions/reducers';
import { EffectsModule } from '@ngrx/effects';
import { JudgeEffects } from '../judges/effects/judge.effects';
import { RoomEffects } from '../rooms/effects/room.effects';
import { SessionEffects } from '../sessions/effects/session.effects';
import { CoreModule } from '../core/core.module';

@NgModule({
    imports: [
        CommonModule,
        SecurityModule,
        NgFullcalendarSchedulerModule,
        CoreModule,
        // StoreModule.forFeature('planner', reducers),
        // EffectsModule.forFeature([SessionEffects, JudgeEffects, RoomEffects]),
    ],
    declarations: [PlannerComponent],
    providers: []
})
export class PlannerModule {
}

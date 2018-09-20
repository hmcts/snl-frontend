import { SummaryMessageService } from './services/summary-message.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityModule } from '../security/security.module';
import { PlannerComponent } from './containers/planner.component';
import { CoreModule } from '../core/core.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatButtonModule, MatButtonToggleModule } from '@angular/material';
import { RoomPlannerComponent } from './components/room-planner/room-planner.component';
import { JudgePlannerComponent } from './components/judge-planner/judge-planner.component';
import { SessionModule } from '../sessions/session.module';

@NgModule({
    imports: [
        CommonModule,
        SecurityModule,
        CoreModule,
        AngularMaterialModule,
        MatButtonModule,
        MatButtonToggleModule,
        SessionModule,
    ],
    declarations: [PlannerComponent, RoomPlannerComponent, JudgePlannerComponent],
    providers: [SummaryMessageService]
})
export class PlannerModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityModule } from '../security/security.module';
import { PlannerComponent } from './containers/planner.component';
import { CoreModule } from '../core/core.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatButtonModule, MatButtonToggleModule } from '@angular/material';
import { RoomPlannerComponent } from './components/room-planner/room-planner.component';
import { JudgePlannerComponent } from './components/judge-planner/judge-planner.component';

@NgModule({
    imports: [
        CommonModule,
        SecurityModule,
        CoreModule,
        AngularMaterialModule,
        MatButtonModule,
        MatButtonToggleModule
    ],
    declarations: [PlannerComponent, RoomPlannerComponent, JudgePlannerComponent],
    providers: []
})
export class PlannerModule {
}

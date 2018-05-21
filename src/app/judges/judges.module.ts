import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SecurityModule } from '../security/security.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MainComponent } from './components/main/main.component';
import { reducers } from './reducers';
import { JudgeEffects } from './effects/judge.effects';
import { CalendarContainerComponent } from '../core/callendar/containers/calendar-container.component';
import { CoreModule } from '../core/core.module';

@NgModule({
    imports: [
        CommonModule,
        FullCalendarModule,
        CoreModule,
        SecurityModule,
        RouterModule.forChild([
            {path: '', redirectTo: 'main', pathMatch: 'full'},
            {
                path: 'main',
                component: MainComponent
            },
            {
                path: 'diary-calendar',
                component: CalendarContainerComponent,
                data: {forSpecificJudge: true}
            }
        ]),
        StoreModule.forFeature('judges', reducers),
        EffectsModule.forFeature([JudgeEffects])
    ],
    declarations: [MainComponent],
    providers: []
})
export class JudgesModule {
}

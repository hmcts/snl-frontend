import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiaryCalendarComponent } from './diary-calendar/diary-calendar.component';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from 'ng-fullcalendar';
import { SecurityModule } from '../security/security.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MainComponent } from './components/main/main.component';
import { reducers } from './reducers';
import { JudgeEffects } from './effects/judge.effects';

@NgModule({
    imports: [
        CommonModule,
        FullCalendarModule,
        SecurityModule,
        RouterModule.forChild([
            {path: '', redirectTo: 'main', pathMatch: 'full'},
            {
                path: 'main',
                component: MainComponent
            },
            {
                path: 'diary-calendar',
                component: DiaryCalendarComponent
            }
        ]),
        StoreModule.forFeature('judges', reducers),
        EffectsModule.forFeature([JudgeEffects])
    ],
    declarations: [DiaryCalendarComponent, MainComponent],
    providers: []
})
export class JudgesModule {
}

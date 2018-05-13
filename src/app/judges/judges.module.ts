import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiaryCalendarComponent } from './diary-calendar/diary-calendar.component';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from 'ng-fullcalendar';
import { SecurityModule } from '../security/security.module';
import { StoreModule } from '@ngrx/store';
import * as fromReducers from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { DiaryEffectEffects } from './effects/diary-effect.effects';
import { DiaryService } from './services/diary.service';
import { MainComponent } from './components/main/main.component';
import { reducers } from './reducers';

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
        EffectsModule.forFeature([DiaryEffectEffects])
    ],
    declarations: [DiaryCalendarComponent, MainComponent],
    providers: [DiaryService]
})
export class JudgesModule {
}

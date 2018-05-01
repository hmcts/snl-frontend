import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiaryCalendarComponent } from './diary-calendar/diary-calendar.component';
import { AuthPageComponent } from '../security/containers/auth-page/auth-page.component';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from 'ng-fullcalendar';
import { SecurityModule } from '../security/security.module';

@NgModule({
    imports: [
        CommonModule,
        FullCalendarModule,
        SecurityModule,
        RouterModule.forChild([{
            path: '',
            component: AuthPageComponent,
            children: [
                {path: '', redirectTo: 'diary-calendar', pathMatch: 'full'},
                {
                    path: 'diary-calendar',
                    component: DiaryCalendarComponent
                }
            ]
        },
        ]),
    ],
    declarations: [DiaryCalendarComponent]
})
export class JudgesModule {
}

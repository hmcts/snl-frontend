import { NgModule } from '@angular/core';
import { AppConfigGuard } from './app-config.guard';
import { RouterModule, Routes } from '@angular/router';
import { CallendarComponent } from './core/callendar/callendar.component';

const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: CallendarComponent, canActivate: [AppConfigGuard] },
    { path: 'calendar', component: CallendarComponent },
    { path: 'sessions', loadChildren: 'app/sessions/session.module#SessionModule'},
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, ) ],
    exports: [ RouterModule ],
    providers: [
        AppConfigGuard
    ]
})
export class AppRoutingModule { }

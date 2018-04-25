import { NgModule } from '@angular/core';
import { AppConfigGuard } from './app-config.guard';
import { RouterModule, Routes } from '@angular/router';
import { CallendarComponent } from './core/callendar/callendar.component';
import { SessionsPageComponent } from './sessions/containers/sessions-page/sessions-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: CallendarComponent, canActivate: [AppConfigGuard] },
    { path: 'calendar', component: CallendarComponent },
    { path: 'sessions', component: SessionsPageComponent },

];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {enableTracing: true}) ],
    exports: [ RouterModule ],
    providers: [
        AppConfigGuard
    ]
})
export class AppRoutingModule { }

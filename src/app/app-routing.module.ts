import { NgModule } from '@angular/core';
import { AppConfigGuard } from './app-config.guard';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './security/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from 'ng-fullcalendar';
import { SessionsPageComponent } from './sessions/containers/sessions-page/sessions-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AppConfigGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AppConfigGuard] },
  { path: 'sessions', component: SessionsPageComponent, canActivate: [AppConfigGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
    exports: [ RouterModule ],
    providers: [
        AppConfigGuard
    ]
})
export class AppRoutingModule { }

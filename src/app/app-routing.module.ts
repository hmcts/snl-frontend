import { NgModule } from '@angular/core';
import { AppConfigGuard } from './app-config.guard';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './security/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from 'ng-fullcalendar';
import { SessionsPageComponent } from './sessions/containers/sessions-page/sessions-page.component';
import { HomeComponent } from './core/home/home.component';
import { AuthGuard } from './security/guards/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent,
        children: [
        { path: '', redirectTo: 'dashboard',  pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent, canActivate: [AppConfigGuard] },
        { path: 'calendar', component: CalendarComponent, canActivate: [AppConfigGuard] },
        { path: 'sessions', component: SessionsPageComponent, canActivate: [AppConfigGuard] }
        ],
        canActivate: [AuthGuard]
    },
    { path: 'login', component: LoginComponent, canActivate: [AppConfigGuard]}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
    providers: [
        AppConfigGuard
    ]
})
export class AppRoutingModule { }

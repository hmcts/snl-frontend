import { NgModule } from '@angular/core';
import { AppConfigGuard } from './app-config.guard';
import { RouterModule, Routes } from '@angular/router';
import { CallendarComponent } from './core/callendar/callendar.component';
import { AuthGuard } from './security/guards/auth.guard';
import { HomeComponent } from './core/home/home.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent,
        children: [
            { path: '', redirectTo: 'calendar',  pathMatch: 'full' },
            { path: 'calendar', component: CallendarComponent, canActivate: [AppConfigGuard] },
            { path: 'sessions', loadChildren: 'app/sessions/session.module#SessionModule', canActivate: [AppConfigGuard]},
        ],
        canActivate: [AuthGuard]
    },
    { path: 'auth', loadChildren: 'app/security/security.module#SecurityModule', canActivate: [AppConfigGuard]},
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, ) ],
    exports: [ RouterModule ],
    providers: [
        AppConfigGuard
    ]
})
export class AppRoutingModule { }

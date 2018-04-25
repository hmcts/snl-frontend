import { NgModule } from '@angular/core';
import { AppConfigGuard } from './app-config.guard';
import { RouterModule, Routes } from '@angular/router';
import { CallendarComponent } from './core/callendar/callendar.component';
import { SessionsPageComponent } from './sessions/containers/sessions-page/sessions-page.component';
import { SessionsCreateComponent } from './sessions/components/sessions-create/sessions-create.component';
import { SessionsSearchComponent } from './sessions/components/sessions-search/sessions-search.component';

const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: CallendarComponent, canActivate: [AppConfigGuard] },
    { path: 'calendar', component: CallendarComponent },
    {
        path: 'sessions',
        component: SessionsPageComponent,
        children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            {
                path: 'search',
                component: SessionsSearchComponent
            }, {
                path: 'create',
                component: SessionsCreateComponent
            }
        ] },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {enableTracing: true}) ],
    exports: [ RouterModule ],
    providers: [
        AppConfigGuard
    ]
})
export class AppRoutingModule { }

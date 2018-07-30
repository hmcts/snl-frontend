import { NgModule } from '@angular/core';
import { AppConfigGuard } from './app-config.guard';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './security/guards/auth.guard';
import { HomeComponent } from './core/home/home.component';
import { ListingCreateComponent } from './hearing-part/components/listing-create/listing-create.component';
import { PocComponent } from './admin/components/poc/poc.component';
import { CalendarContainerComponent } from './core/callendar/containers/calendar-container.component';
import { ProblemsPageComponent } from './problems/containers/problems/problems-page.component';
import { PlannerComponent } from './planner/containers/planner.component';
import { SessionModule } from './sessions/session.module';
import { JudgesModule } from './judges/judges.module';
import { ReportModule } from './features/reports/report.module';
import { SecurityModule } from './security/security.module';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {
        path: 'home', component: HomeComponent,
        children: [
            {path: '', redirectTo: 'calendar', pathMatch: 'full'},
            {path: 'calendar', component: CalendarContainerComponent, canActivate: [AppConfigGuard], data: { forSpecificJudge: false }},
            {path: 'planner', component: PlannerComponent, canActivate: [AppConfigGuard]},
            {path: 'sessions', loadChildren: () => SessionModule, canActivate: [AppConfigGuard]},
            {path: 'judge', loadChildren: () => JudgesModule, canActivate: [AppConfigGuard, AuthGuard]},
            {path: 'listing', component: ListingCreateComponent, canActivate: [AppConfigGuard]},
            {path: 'poc', component: PocComponent, canActivate: [AppConfigGuard]},
            {path: 'problems', component: ProblemsPageComponent, canActivate: [AppConfigGuard]},
            {path: 'reports', loadChildren: () => ReportModule, canActivate: [AppConfigGuard]}
        ],
        canActivate: [AuthGuard]
    },
    {
        path: 'poc', component: PocComponent,
        canActivate: [AuthGuard]
    },
    {path: 'auth', loadChildren: () => SecurityModule, canActivate: [AppConfigGuard]},
    {path: '**', redirectTo: 'auth'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: false})],
    exports: [RouterModule],
    providers: [
        AppConfigGuard
    ]
})
export class AppRoutingModule {
}

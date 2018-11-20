import { NgModule } from '@angular/core';
import { AppConfigGuard } from './app-config.guard';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './security/guards/auth.guard';
import { HomeComponent } from './core/home/home.component';
import { ListingCreateComponent } from './hearing-part/components/listing-create/listing-create.component';
import { CalendarContainerComponent } from './core/callendar/containers/calendar-container.component';
import { ProblemsPageComponent } from './problems/containers/problems/problems-page.component';
import { PlannerComponent } from './planner/containers/planner.component';
import { SessionsListingsSearchComponent } from './sessions/containers/sessions-listings-search/sessions-listings-search.component';
import { HearingsSearchComponent } from './hearing-part/containers/hearings-search/hearings-search.component';
import { ViewHearingComponent } from './hearing/components/view-hearing/view-hearing.component';
import { StatusConfigResolver } from './core/reference/resolvers/status-config.resolver';
import { RulesEngineStatusComponent } from './admin/components/rules-engine-status/rules-engine-status.component';
import { CaseTypesResolver } from './core/reference/resolvers/case-types.resolver';
import { JudgesResolver } from './judges/resolvers/judges.resolver';
import { HearingTypesResolver } from './core/reference/resolvers/hearing-types.resolver';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {
        path: 'home', component: HomeComponent,
        children: [
            {path: '', redirectTo: 'calendar', pathMatch: 'full'},
            {path: 'calendar', component: CalendarContainerComponent, canActivate: [AppConfigGuard], data: { forSpecificJudge: false }},
            {path: 'planner', component: PlannerComponent, canActivate: [AppConfigGuard]},
            {path: 'sessions', loadChildren: 'app/sessions/session.module#SessionModule', canActivate: [AppConfigGuard]},
            {path: 'judge', loadChildren: 'app/judges/judges.module#JudgesModule', canActivate: [AppConfigGuard, AuthGuard]},
            {path: 'listing', component: ListingCreateComponent, canActivate: [AppConfigGuard]},
            {path: 'rules', component: RulesEngineStatusComponent, canActivate: [AppConfigGuard]},
            {path: 'problems', component: ProblemsPageComponent, canActivate: [AppConfigGuard]},
            {path: 'reports', loadChildren: 'app/features/reports/report.module#ReportModule', canActivate: [AppConfigGuard]},
            {path: 'listinghearings/search', component: HearingsSearchComponent, canActivate: [AppConfigGuard],
                resolve: { judges: JudgesResolver, caseTypes: CaseTypesResolver, hearingTypes: HearingTypesResolver}},
            {path: 'listinghearings/assign', component: SessionsListingsSearchComponent, canActivate: [AppConfigGuard]},
            {path: 'hearing/:id', component: ViewHearingComponent, canActivate: [AppConfigGuard]}
        ],
        canActivate: [AuthGuard], resolve: { statusConfig: StatusConfigResolver, caseTypes: CaseTypesResolver }
    },
    {
        path: 'rules', component: RulesEngineStatusComponent,
        canActivate: [AuthGuard]
    },
    {path: 'auth', loadChildren: 'app/security/security.module#SecurityModule', canActivate: [AppConfigGuard]},
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

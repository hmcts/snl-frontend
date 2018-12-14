import { NgModule } from '@angular/core';
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
import { SessionTypesResolver } from './core/reference/resolvers/session-types.resolver';
import { RoomsResolver } from './rooms/resolvers/rooms.resolver';
import { PageNotFoundComponent } from './errors/page-not-found.component';
import { GlobalErrorComponent } from './errors/global-error.component';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {
        path: 'home', component: HomeComponent,
        children: [
            {path: '', redirectTo: 'calendar', pathMatch: 'full'},
            {path: 'calendar', component: CalendarContainerComponent, canActivate: [AuthGuard],
                data: { forSpecificJudge: false }},
            {path: 'planner', component: PlannerComponent, canActivate: [AuthGuard]},
            {path: 'sessions', loadChildren: 'app/sessions/session.module#SessionModule', canActivate: [AuthGuard]},
            {path: 'judge', loadChildren: 'app/judges/judges.module#JudgesModule', canActivate: [AuthGuard]},
            {path: 'listing', component: ListingCreateComponent, canActivate: [AuthGuard]},
            {path: 'rules', component: RulesEngineStatusComponent, canActivate: [AuthGuard]},
            {path: 'problems', component: ProblemsPageComponent, canActivate: [AuthGuard]},
            {path: 'reports', loadChildren: 'app/features/reports/report.module#ReportModule', canActivate: [AuthGuard]},
            {path: 'listinghearings/search', component: HearingsSearchComponent, canActivate: [AuthGuard],
                resolve: { judges: JudgesResolver, caseTypes: CaseTypesResolver, hearingTypes: HearingTypesResolver}},
            {path: 'listinghearings/assign', component: SessionsListingsSearchComponent, canActivate: [AuthGuard],
                resolve: { judges: JudgesResolver, rooms: RoomsResolver, sessionTypes: SessionTypesResolver, caseTypes: CaseTypesResolver}},
            {path: 'hearing/:id', component: ViewHearingComponent, canActivate: [AuthGuard]}
        ],
        canActivate: [AuthGuard], resolve: { sessionTypes: StatusConfigResolver, judges: JudgesResolver }
    },
    // routes that do not require authentication
    {path: 'auth', loadChildren: 'app/security/security.module#SecurityModule', canActivate: []},
    {path: 'error', component: GlobalErrorComponent, canActivate: []},
    {path: 'login', redirectTo: 'auth', canActivate: []},
    {path: 'logout', redirectTo: 'auth', canActivate: []},
    {path: '**', component: PageNotFoundComponent, canActivate: []}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: false})],
    exports: [RouterModule],
    providers: [
    ]
})
export class AppRoutingModule {
}

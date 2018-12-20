import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { APP_ID, Inject, Injectable, LOCALE_ID, NgModule, PLATFORM_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { SessionsService } from './sessions/services/sessions-service';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppConfig } from './app.config';
import { AppConfigGuard } from './app-config.guard';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { isPlatformBrowser } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SessionModule } from './sessions/session.module';
import { SecurityModule } from './security/security.module';
import { HomeComponent } from './core/home/home.component';
import { SecurityService } from './security/services/security.service';
import { JudgesModule } from './judges/judges.module';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HearingPartModule } from './hearing-part/hearing-part.module';
import { AdminModule } from './admin/admin.module';
import * as moment from 'moment';
import { ProblemsModule } from './problems/problems.module';
import { CoreModule } from './core/core.module';
import { PlannerModule } from './planner/planner.module';
import { FullCalendarModule } from './common/ng-fullcalendar/module';
import { NotificationModule } from './features/notification/notification.module';
import { getLocalStorage } from './utils/storage';
import { ReportModule } from './features/reports/report.module';
import { NotesModule } from './notes/notes.module';
import { TransactionsModule } from './features/transactions/transactions.module';
import { AuthHttpInterceptor } from './security/services/auth-http-interceptor';
import { SecurityContext } from './security/services/security-context.service';
import { HmctsModule } from './hmcts/hmcts.module';
import { GovukModule } from './govuk/govuk.module';
import { HearingModule } from './hearing/hearing.module';
import { InMemoryStorageService } from './core/services/in-memory-storage.service';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const xhr = req.clone({
            headers: req.headers.set('X-Requested-With', 'XMLHttpRequest'),
            withCredentials: true
        });
        return next.handle(xhr);
    }
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'snl-frontend'}),
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
            name: 'snl-frontend'
        }),
        EffectsModule.forRoot([]),
        HttpClientModule,
        FormsModule,
        CoreModule.forRoot(),
        AppRoutingModule,
        AngularMaterialModule,
        FullCalendarModule,
        FlexLayoutModule,
        SessionModule,
        SecurityModule,
        AdminModule,
        NotificationModule,
        JudgesModule,
        HearingPartModule,
        ProblemsModule,
        PlannerModule,
        ReportModule,
        NotesModule,
        TransactionsModule,
        HmctsModule,
        GovukModule,
        HearingModule
    ],
    providers: [SessionsService, AppConfig, AppConfigGuard, SecurityService, SecurityContext,
        {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true},
        {provide: LOCALE_ID, useValue: AppConfig.locale},
        {provide: 'STORAGE', useFactory: getLocalStorage},
        {provide: 'InMemoryStorageService', useValue: new InMemoryStorageService()}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        @Inject(LOCALE_ID) localeId: string,
        @Inject(APP_ID) appId: string) {
        const platform = isPlatformBrowser(platformId) ?
            'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId=${appId}`);

        // @ts-ignore is better than defining default format as const we need to pass to every format() call
        moment.defaultFormat = 'DD/MM/YYYY';

        moment.locale(localeId, {
            invalidDate: ''
        });
    }
}

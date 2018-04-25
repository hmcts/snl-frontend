import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { APP_ID, Inject, Injectable, NgModule, PLATFORM_ID } from '@angular/core';

import { sessionReducer } from './sessions/reducers/session.reducer';

import { AppComponent } from './app.component';
import { SessionTableComponent } from './sessions/containers/session-table/session-table.component';
import { EffectsModule } from '@ngrx/effects';
import { SessionEffects } from './sessions/effects/session.effects';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { SessionsService } from './sessions/services/sessions-service';
import { FormsModule } from '@angular/forms';

import { SessionsPageComponent } from './sessions/containers/sessions-page/sessions-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppConfig } from './app.config';
import { AppConfigGuard } from './app-config.guard';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { isPlatformBrowser } from '@angular/common';

import { FullCalendarModule } from 'ng-fullcalendar';
import { CallendarComponent } from './core/callendar/callendar.component';
import { SecurityModule } from './security/security.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const xhr = req.clone({
            headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
        });
        return next.handle(xhr);
    }
}

@NgModule({
    declarations: [
        AppComponent,
        SessionTableComponent,
        SessionsPageComponent,
        CallendarComponent,
        DashboardComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'snl-frontend'}),
        BrowserAnimationsModule,
        StoreModule.forRoot({sessionsReducer: sessionReducer}),
        EffectsModule.forRoot([SessionEffects]),
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        AngularMaterialModule,
        FullCalendarModule,
        SecurityModule
    ],
    providers: [SessionsService, AppConfig, AppConfigGuard,
        {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true}],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(APP_ID) private appId: string) {
        const platform = isPlatformBrowser(platformId) ?
            'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId=${appId}`);
    }

}

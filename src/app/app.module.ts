import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { APP_ID, Inject, NgModule, PLATFORM_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { SessionsService } from './sessions/services/sessions-service';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppConfig } from './app.config';
import { AppConfigGuard } from './app-config.guard';
import { AppRoutingModule } from './/app-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { isPlatformBrowser } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FullCalendarModule } from 'ng-fullcalendar';
import { CallendarComponent } from './core/callendar/callendar.component';
import { SessionModule } from './sessions/session.module';
import { SecurityModule } from './security/security.module';
import { AuthPageComponent } from './security/containers/auth-page/auth-page.component';

@NgModule({
  declarations: [
    AppComponent,
    CallendarComponent,
    AuthPageComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'snl-frontend' }),
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AngularMaterialModule,
    FullCalendarModule,
    FlexLayoutModule,
    SessionModule,
    SecurityModule
  ],
  providers: [SessionsService, AppConfig, AppConfigGuard],
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { sessionReducer } from './sessions/reducers/session.reducer';

import { AppComponent } from './app.component';
import { SessionTableComponent } from './sessions/containers/session-table/session-table.component';
import { EffectsModule } from '@ngrx/effects';
import { SessionEffects } from './sessions/effects/session.effects';
import { HttpClientModule } from '@angular/common/http';
import { SessionsService } from './sessions/services/sessions-service';
import { FormsModule } from '@angular/forms';

import { SessionsPageComponent } from './sessions/containers/sessions-page/sessions-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppConfig } from './app.config';
import { AppConfigGuard } from './app-config.guard';
import { AppRoutingModule } from './/app-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';


@NgModule({
  declarations: [
    AppComponent,
    SessionTableComponent,
    SessionsPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({sessionsReducer: sessionReducer}),
    EffectsModule.forRoot([SessionEffects]),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AngularMaterialModule
  ],
  providers: [SessionsService, AppConfig, AppConfigGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

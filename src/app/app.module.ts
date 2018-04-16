import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { sessionReducer } from './sessions/reducers/session.reducer';

import { AppComponent } from './app.component';
import { SessionTableComponent } from './sessions/containers/session-table/session-table.component';
import { EffectsModule } from "@ngrx/effects";
import { SessionEffects } from "./sessions/effects/session.effects";
import { HttpClientModule } from "@angular/common/http";
import { SessionsService } from "./sessions/services/sessions-service";
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatListModule, MatCardModule, MatIconModule,
  MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule,
  MatDatepickerModule, MatNativeDateModule, MatGridListModule } from '@angular/material';

import { SessionsPageComponent } from './core/components/sessions-page/sessions-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppConfig} from "./app.config";


@NgModule({
  declarations: [
    AppComponent,
    SessionTableComponent,
    SessionsPageComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({sessionsReducer: sessionReducer}),
    EffectsModule.forRoot([SessionEffects]),
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatListModule,
    BrowserAnimationsModule,
    FormsModule,
    MatTableModule
  ],
  providers: [SessionsService, AppConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }

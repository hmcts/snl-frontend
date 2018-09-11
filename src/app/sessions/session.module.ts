import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SessionEffects } from './effects/session.effects';
import { SessionsPageComponent } from './containers/sessions-page/sessions-page.component';
import { SessionsCreateComponent } from './containers/sessions-create/sessions-create.component';
import { SessionsSearchComponent } from './containers/sessions-search/sessions-search.component';
import { SessionTableComponent } from './components/session-table/session-table.component';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionsService } from './services/sessions-service';
import { reducers } from './reducers';
import { JudgeEffects } from '../judges/effects/judge.effects';
import { RoomEffects } from '../rooms/effects/room.effects';
import { JudgeService } from '../judges/services/judge.service';
import { RoomService } from '../rooms/services/room.service';
import { HearingPartModule } from '../hearing-part/hearing-part.module';
import { SessionsFilterComponent } from './components/sessions-filter/sessions-filter.component';
import { DetailsDialogComponent } from './components/details-dialog/details-dialog.component';
import { SessionsStatisticsService } from './services/sessions-statistics-service';
import { CoreModule } from '../core/core.module';
import { SessionsCreateFormComponent } from './components/sessions-create-form/sessions-create-form.component';
import { SessionsCreationService } from './services/sessions-creation.service';
import { SessionsPropositionsSearchComponent } from './containers/sessions-propositions-search/sessions-propositions-search.component';
import { SessionsPropositionsTableComponent } from './components/sessions-propositions-table/sessions-propositions-table.component';
import { SessionsPropositionsFormComponent } from './components/sessions-propositions-form/sessions-propositions-form.component';
import { SessionEditOrCreateDialogComponent } from './components/session-edit-or-create-dialog/session-edit-or-create-dialog.component';
import { TransactionsModule } from '../features/transactions/transactions.module';

export const COMPONENTS = [
    SessionsPageComponent,
    SessionsCreateComponent,
    SessionsSearchComponent,
    SessionTableComponent,
    SessionsFilterComponent,
    DetailsDialogComponent,
    SessionsCreateFormComponent,
    SessionEditOrCreateDialogComponent,
    SessionsPropositionsSearchComponent,
    SessionsPropositionsTableComponent,
    SessionsPropositionsFormComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
      FlexLayoutModule,
      FormsModule,
      ReactiveFormsModule,
      HearingPartModule,
      TransactionsModule,
      CoreModule,
    StoreModule.forFeature('sessions', reducers),
    EffectsModule.forFeature([SessionEffects, JudgeEffects, RoomEffects]),
    RouterModule.forChild([{
        path: '',
        component: SessionsPageComponent,
        children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            {
                path: 'search',
                component: SessionsSearchComponent
            }, {
                path: 'create',
                component: SessionsCreateComponent
            }, {
                path: 'search-proposition',
                component: SessionsPropositionsSearchComponent
            }
        ]},
    ]),
  ],
  entryComponents: [DetailsDialogComponent, SessionEditOrCreateDialogComponent],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [SessionsService, JudgeService, RoomService, SessionsStatisticsService, SessionsCreationService]
})
export class SessionModule { }

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
import { TransactionsModule } from '../features/transactions/transactions.module';
import { SessionAmendmentTableComponent } from './components/session-amendment-table/session-amendment-table.component';
import { SessionsListingsSearchComponent } from './containers/sessions-listings-search/sessions-listings-search.component';
import { SessionsFilterService } from './services/sessions-filter-service';
import { SessionsAmendFormComponent } from './components/sessions-amend-form/sessions-amend-form.component';
import { SessionAmendDialogComponent } from './components/session-amend-dialog/session-amend-dialog';
import { NotesModule } from '../notes/notes.module';
import { SessionCreateNotesConfiguration } from './models/session-create-notes-configuration.model';
import { RoomsResolver } from '../rooms/resolvers/rooms.resolver';
import { JudgesResolver } from '../judges/resolvers/judges.resolver';
import { SessionTypesResolver } from '../core/reference/resolvers/session-types.resolver';
import { SessionSearchCriteriaService } from './services/session-search-criteria.service';

export const COMPONENTS = [
  SessionsPageComponent,
  SessionsCreateComponent,
  SessionTableComponent,
  SessionsFilterComponent,
  DetailsDialogComponent,
  SessionsCreateFormComponent,
  SessionsSearchComponent,
  SessionAmendmentTableComponent,
  SessionsListingsSearchComponent,
  SessionsAmendFormComponent,
  SessionAmendDialogComponent
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
    NotesModule,
    StoreModule.forFeature('sessions', reducers),
    EffectsModule.forFeature([SessionEffects, JudgeEffects, RoomEffects]),
    RouterModule.forChild([{
      path: '',
      component: SessionsPageComponent,
      children: [
        {path: '', redirectTo: 'search', pathMatch: 'full'},
        {
          path: 'search',
          component: SessionsSearchComponent,
          resolve: { judges: JudgesResolver, rooms: RoomsResolver, sessionTypes: SessionTypesResolver}
        }, {
          path: 'create',
          component: SessionsCreateComponent
        }
      ]
    },
    ]),
  ],
  entryComponents: [DetailsDialogComponent, SessionAmendDialogComponent],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [SessionsService, JudgeService, RoomService, SessionsStatisticsService,
    SessionsCreationService, SessionsFilterService, SessionCreateNotesConfiguration,
    SessionSearchCriteriaService, RoomsResolver]
})
export class SessionModule {
}

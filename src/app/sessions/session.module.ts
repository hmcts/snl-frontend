import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SessionEffects } from './effects/session.effects';
import { SessionsPageComponent } from './containers/sessions-page/sessions-page.component';
import { SessionsCreateComponent } from './containers/sessions-create/sessions-create.component';
import { SessionsSearchComponent } from './components/sessions-search/sessions-search.component';
import { SessionTableComponent } from './components/session-table/session-table.component';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { SessionsService } from './services/sessions-service';
import { reducers } from './reducers/index';
import { JudgeEffects } from '../judges/effects/judge.effects';
import { RoomEffects } from '../rooms/effects/room.effects';
import { JudgeService } from '../judges/services/judge.service';
import { RoomService } from '../rooms/services/room.service';
import { HearingPartModule } from '../hearing-part/hearing-part.module';
import { SessionsFilterComponent } from './components/sessions-filter/sessions-filter.component';
import { DetailsDialogComponent } from './components/details-dialog/details-dialog.component';
import { SessionsStatisticsService } from './services/sessions-statistics-service';
import { CoreModule } from '../core/core.module';
import { SessionsCreateDialogComponent } from './components/sessions-create-dialog/sessions-create-dialog.component';
import { SessionsCreateFormComponent } from './components/sessions-create-form/sessions-create-form.component';

export const COMPONENTS = [
    SessionsPageComponent,
    SessionsCreateComponent,
    SessionsSearchComponent,
    SessionTableComponent,
    SessionsFilterComponent,
    DetailsDialogComponent,
    SessionsCreateDialogComponent,
    SessionsCreateFormComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
      FlexLayoutModule,
      FormsModule,
      HearingPartModule,
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
            }
        ]},
    ]),
  ],
  entryComponents: [DetailsDialogComponent, SessionsCreateDialogComponent],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [SessionsService, JudgeService, RoomService, SessionsStatisticsService]
})
export class SessionModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SessionEffects } from './effects/session.effects';
import { SessionsPageComponent } from './containers/sessions-page/sessions-page.component';
import { SessionsCreateComponent } from './components/sessions-create/sessions-create.component';
import { SessionsSearchComponent } from './components/sessions-search/sessions-search.component';
import { SessionTableComponent } from './containers/session-table/session-table.component';
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
import { DetailsDialogComponent } from './components/details-dialog/details-dialog.component';
import { SessionsStatisticsService } from './services/sessions-statistics-service';

export const COMPONENTS = [
    SessionsPageComponent,
    SessionsCreateComponent,
    SessionsSearchComponent,
    SessionTableComponent,
    DetailsDialogComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
      FlexLayoutModule,
      FormsModule,
      HearingPartModule,
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
  entryComponents: [DetailsDialogComponent],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [SessionsService, JudgeService, RoomService, SessionsStatisticsService]
})
export class SessionModule { }

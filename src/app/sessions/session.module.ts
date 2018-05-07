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
import { sessionReducer } from './reducers/session.reducer';
import { roomReducer } from '../rooms/reducers/room.reducer';
import { judgeReducer } from '../judges/reducers/judge.reducer';
import { JudgeEffects } from '../judges/effects/judge.effects';
import { RoomEffects } from '../rooms/effects/room.effects';
import { JudgeService } from '../judges/services/judge.service';
import { RoomService } from '../rooms/services/room.service';

export const COMPONENTS = [
    SessionsPageComponent,
    SessionsCreateComponent,
    SessionsSearchComponent,
    SessionTableComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
      FlexLayoutModule,
      FormsModule,
    StoreModule.forFeature('sessions', {sessions: sessionReducer, rooms: roomReducer, judges: judgeReducer}),
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
  declarations: COMPONENTS,
  exports: COMPONENTS,
    providers: [SessionsService, JudgeService, RoomService]
})
export class SessionModule { }

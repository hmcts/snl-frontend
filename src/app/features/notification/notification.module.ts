import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogWithActionsComponent } from './components/dialog-with-actions/dialog-with-actions.component';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { reducer } from './reducers/notification.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NotificationEffects } from './effects/notification.effects';

export const COMPONENTS = [
    DialogInfoComponent,
    DialogWithActionsComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    StoreModule.forFeature('notifications', reducer),
    EffectsModule.forFeature([NotificationEffects]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  entryComponents: [
      DialogInfoComponent,
      DialogWithActionsComponent
  ]
})
export class NotificationModule { }

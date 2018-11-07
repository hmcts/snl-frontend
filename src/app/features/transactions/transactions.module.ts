import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { TransactionBackendService } from './services/transaction-backend.service';
import { TransactionDialogComponent } from './components/transaction-dialog/transaction-dialog.component';
import { reducers } from './reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TransactionEffects } from './effects/transaction.effects';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TransactionService } from './services/transaction.service';

const COMPONENTS = [
    TransactionDialogComponent
];
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FlexLayoutModule,
    AngularMaterialModule,
    StoreModule.forFeature('transactions', reducers),
    EffectsModule.forFeature([TransactionEffects]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [TransactionBackendService, TransactionService],
  entryComponents: [TransactionDialogComponent]
})
export class TransactionsModule { }

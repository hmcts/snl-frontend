import { TransactionDialogComponent } from '../transactions/components/transaction-dialog/transaction-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { ActivitiesLogComponent } from './components/activities-log.component';
import { ActivityLogService } from './services/activity-log.service';

const COMPONENTS = [
    ActivitiesLogComponent
];
@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FlexLayoutModule,
        AngularMaterialModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    providers: [ActivityLogService],
    entryComponents: [TransactionDialogComponent]
})
export class ActivityLogModule { }

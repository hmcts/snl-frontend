import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityModule } from '../security/security.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { RulesEngineService } from './services/rules-engine/rules-engine-service';
import { RulesEngineStatusComponent } from './components/rules-engine-status/rules-engine-status.component';

@NgModule({
    imports: [
        CommonModule,
        SecurityModule,
        AngularMaterialModule
    ],
  providers: [ RulesEngineService ],
  declarations: [ RulesEngineStatusComponent ],
  exports: [ RulesEngineStatusComponent ]
})
export class AdminModule {
}

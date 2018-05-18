import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityModule } from '../security/security.module';
import { PocService } from './services/poc-service';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

@NgModule({
    imports: [
        CommonModule,
        SecurityModule,
        AngularMaterialModule
    ],
  providers: [
    PocService
  ]
})
export class AdminModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewHearingComponent } from './components/view-hearing/view-hearing.component';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { HearingService } from './services/hearing.service';
import { FlexLayoutModule } from '@angular/flex-layout';

const COMPONENTS = [
  ViewHearingComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [HearingService]
})
export class HearingModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingCreateComponent } from './components/listing-create/listing-create.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HearingPartsPreviewComponent } from './components/hearing-parts-preview/hearing-parts-preview.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers/index';
import { HearingPartService } from './services/hearing-part-service';
import { EffectsModule } from '@ngrx/effects';
import { HearingPartEffects } from './effects/hearing-part.effects';
import { ListingCreateEffects } from './effects/listing-create.effects';

export const COMPONENTS = [
    HearingPartsPreviewComponent,
    ListingCreateComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    StoreModule.forFeature('hearingParts', reducers),
    EffectsModule.forFeature([HearingPartEffects, ListingCreateEffects]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [HearingPartService]
})
export class HearingPartModule { }

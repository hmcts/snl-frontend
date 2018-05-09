import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingCreateComponent } from './components/listing-create/listing-create.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HearingPartsPreviewComponent } from './components/hearing-parts-preview/hearing-parts-preview.component';
import { StoreModule } from '@ngrx/store';
import { hearingPartReducer } from './reducers/hearing-part.reducer';

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
    StoreModule.forFeature('hearingParts', {hearingParts: hearingPartReducer}),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class HearingPartModule { }

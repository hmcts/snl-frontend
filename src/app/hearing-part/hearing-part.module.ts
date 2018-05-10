import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingCreateComponent } from './components/listing-create/listing-create.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ListingCreateEffects } from './effects/listing-create.effects';
import { hearingPartReducer } from './reducers/hearing-part.reducer';
import { HearingPartService } from './services/hearing-part.service';

export const COMPONENTS = [
    ListingCreateComponent
];

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        FlexLayoutModule,
        FormsModule,
        StoreModule.forFeature('hearingParts', {hearingParts: hearingPartReducer}),
        EffectsModule.forFeature([ListingCreateEffects]),
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    providers: [HearingPartService]
})
export class HearingPartModule { }

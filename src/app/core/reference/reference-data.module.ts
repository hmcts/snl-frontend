import { NgModule } from '@angular/core';
import { ReferenceDataService } from './services/reference-data.service';
import { AppConfig } from '../../app.config';
import { StoreModule } from '@ngrx/store';
import * as fromHT from './reducers/hearing-type.reducer';
import * as fromCT from './reducers/case-type.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ReferenceDataEffects } from './effects/reference-data.effects';

@NgModule({
    imports: [
        StoreModule.forFeature('caseTypes', fromCT.reducer),
        StoreModule.forFeature('hearingTypes', fromHT.reducer),
        EffectsModule.forFeature([ReferenceDataEffects])
    ],
    providers: [AppConfig, ReferenceDataService]
})
export class ReferenceDataModule {
}

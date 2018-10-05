import { NgModule } from '@angular/core';
import { ReferenceDataService } from './services/reference-data.service';
import { AppConfig } from '../../app.config';
import { StoreModule } from '@ngrx/store';
import * as fromHT from './reducers/hearing-type.reducer';
import * as fromCT from './reducers/case-type.reducer';
import * as fromRT from './reducers/room-type.reducer';
import * as fromST from './reducers/session-type.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ReferenceDataEffects } from './effects/reference-data.effects';

@NgModule({
    imports: [
        StoreModule.forFeature('caseTypes', fromCT.reducer),
        StoreModule.forFeature('hearingTypes', fromHT.reducer),
        StoreModule.forFeature('roomTypes', fromRT.reducer),
        StoreModule.forFeature('sessionTypes', fromST.reducer),
        EffectsModule.forFeature([ReferenceDataEffects])
    ],
    providers: [ReferenceDataService]
})
export class ReferenceDataModule {
}

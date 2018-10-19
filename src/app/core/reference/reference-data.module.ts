import { NgModule } from '@angular/core';
import { ReferenceDataService } from './services/reference-data.service';
import { StoreModule } from '@ngrx/store';
import * as fromHT from './reducers/hearing-type.reducer';
import * as fromCT from './reducers/case-type.reducer';
import * as fromRT from './reducers/room-type.reducer';
import * as fromST from './reducers/session-type.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ReferenceDataEffects } from './effects/reference-data.effects';
import { CaseTypeResolver } from './resolvers/case-type.resolver';
import { HearingTypeResolver } from './resolvers/hearing-type.resolver';

const services = [
    ReferenceDataService
];

const resolvers = [
    CaseTypeResolver,
    HearingTypeResolver
];

@NgModule({
    imports: [
        StoreModule.forFeature('caseTypes', fromCT.reducer),
        StoreModule.forFeature('hearingTypes', fromHT.reducer),
        StoreModule.forFeature('roomTypes', fromRT.reducer),
        StoreModule.forFeature('sessionTypes', fromST.reducer),
        EffectsModule.forFeature([ReferenceDataEffects])
    ],
    providers: [...services, ...resolvers]
})
export class ReferenceDataModule {
}

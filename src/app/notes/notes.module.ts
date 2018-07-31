import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityModule } from '../security/security.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { NotesEffects } from './effects/notes.effects';
import { CoreModule } from '../core/core.module';
import { FullCalendarModule } from '../common/ng-fullcalendar/module';
import { NotesService } from './services/notes.service';

@NgModule({
    imports: [
        CommonModule,
        FullCalendarModule,
        CoreModule,
        SecurityModule,
        StoreModule.forFeature('notes', reducers),
        EffectsModule.forFeature([NotesEffects])
    ],
    declarations: [],
    providers: [NotesService]
})
export class NotesModule {
}

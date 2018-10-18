import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingCreateComponent } from './components/listing-create/listing-create.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HearingPartsPreviewComponent } from './components/hearing-parts-preview/hearing-parts-preview.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { HearingPartService } from './services/hearing-part-service';
import { EffectsModule } from '@ngrx/effects';
import { HearingPartEffects } from './effects/hearing-part.effects';
import { ListingCreateEffects } from './effects/listing-create.effects';
import { HearingModificationService } from './services/hearing-modification.service';
import { DraggableHearingPartComponent } from './components/draggable-hearing-part/draggable-hearing-part.component';
import { CoreModule } from '../core/core.module';
import { NotesModule } from '../notes/notes.module';
import { ListingCreateNotesConfiguration } from './models/listing-create-notes-configuration.model';
import { ListingCreateDialogComponent } from './components/listing-create-dialog/listing-create-dialog';
import { ListingNoteListComponent } from './components/listing-note-list/listing-note-list.component';
import { AssignHearingDialogComponent } from './components/assign-hearing-dialog/assign-hearing-dialog.component';

export const COMPONENTS = [
    HearingPartsPreviewComponent,
    ListingCreateComponent,
    DraggableHearingPartComponent,
    DraggableHearingPartComponent,
    ListingCreateDialogComponent,
    ListingNoteListComponent,
    AssignHearingDialogComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    NotesModule,
    FlexLayoutModule,
    CoreModule,
    FormsModule,
    StoreModule.forFeature('hearingParts', reducers),
    EffectsModule.forFeature([HearingPartEffects, ListingCreateEffects]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [HearingPartService, HearingModificationService, ListingCreateNotesConfiguration],
  entryComponents: [ListingCreateDialogComponent, AssignHearingDialogComponent]
})
export class HearingPartModule { }

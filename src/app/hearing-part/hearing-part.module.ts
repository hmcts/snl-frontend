import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingCreateComponent } from './components/listing-create/listing-create.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { HearingPartService } from './services/hearing-part-service';
import { EffectsModule } from '@ngrx/effects';
import { HearingPartEffects } from './effects/hearing-part.effects';
import { ListingCreateEffects } from './effects/listing-create.effects';
import { DraggableHearingPartComponent } from './components/draggable-hearing-part/draggable-hearing-part.component';
import { CoreModule } from '../core/core.module';
import { NotesModule } from '../notes/notes.module';
import { ListingCreateNotesConfiguration } from './models/listing-create-notes-configuration.model';
import { ListingCreateDialogComponent } from './components/listing-create-dialog/listing-create-dialog';
import { ListingNoteListComponent } from './components/listing-note-list/listing-note-list.component';
import { AssignHearingDialogComponent } from './components/assign-hearing-dialog/assign-hearing-dialog.component';
import { HearingAssignmentNotesConfiguration } from './models/hearing-assignment-notes-configuration.model';
import { HearingsFilterComponent } from './components/hearings-filter/hearings-filter.component';
import { HearingsSearchComponent } from './containers/hearings-search/hearings-search.component';
import { HearingSearchTableComponent } from './components/hearing-search-table/hearing-search-table.component';
import { SearchCriteriaService } from './services/search-criteria.service';
import { HearingModificationService } from './services/hearing-modification.service';
import { DateTimeToHHmmPipe } from '../core/pipes/datetime-hhmm.pipe';
import { RouterModule } from '@angular/router';
import { HearingAmendDialogComponent } from './components/hearing-amend-dialog/hearing-amend-dialog.component';
import { HearingAmendComponent } from './components/hearing-amend/hearing-amend.component';
import { HearingsTableComponent } from './components/hearings-table/hearings-table.component';

export const COMPONENTS = [
    HearingsTableComponent,
    ListingCreateComponent,
    DraggableHearingPartComponent,
    ListingCreateDialogComponent,
    AssignHearingDialogComponent,
    HearingAmendDialogComponent,
    HearingAmendComponent,
    HearingsFilterComponent,
    HearingsSearchComponent,
    HearingSearchTableComponent,
    ListingNoteListComponent,
    DateTimeToHHmmPipe
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
    RouterModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [HearingPartService,
      SearchCriteriaService,
      HearingModificationService,
      ListingCreateNotesConfiguration,
      HearingAssignmentNotesConfiguration],
  entryComponents: [ListingCreateDialogComponent, AssignHearingDialogComponent, HearingAmendDialogComponent],
})
export class HearingPartModule { }

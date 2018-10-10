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
import { DraggableHearingPartComponent } from './components/draggable-hearing-part/draggable-hearing-part.component';
import { CoreModule } from '../core/core.module';
import { NotesModule } from '../notes/notes.module';
import { ListingCreateNotesConfiguration } from './models/listing-create-notes-configuration.model';
import { ListingCreateDialogComponent } from './components/listing-create-dialog/listing-create-dialog';
import { ListingNoteListComponent } from './components/listing-note-list/listing-note-list.component';
import { HearingsFilterComponent } from './components/hearings-filter/hearings-filter.component';
import { HearingsSearchComponent } from './containers/hearings-search/hearings-search.component';
import { HearingSearchTableComponent } from './components/hearing-search-table/hearing-search-table.component';
import { RouterModule } from '@angular/router';
import { SessionsPageComponent } from '../sessions/containers/sessions-page/sessions-page.component';
import { HearingsFilterService } from './services/hearings-filter-service';

export const COMPONENTS = [
    HearingPartsPreviewComponent,
    ListingCreateComponent,
    DraggableHearingPartComponent,
    DraggableHearingPartComponent,
    ListingCreateDialogComponent,
    ListingNoteListComponent,
    HearingsFilterComponent,
    HearingsSearchComponent,
    HearingSearchTableComponent
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
    RouterModule.forChild([{
      path: '',
      component: SessionsPageComponent,
      children: [
          { path: '', redirectTo: 'search', pathMatch: 'full' },
          {
              path: 'search',
              component: HearingsSearchComponent
          }
      ]},
    ]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [HearingPartService, HearingsFilterService, ListingCreateNotesConfiguration],
  entryComponents: [ListingCreateDialogComponent],
})
export class HearingPartModule { }

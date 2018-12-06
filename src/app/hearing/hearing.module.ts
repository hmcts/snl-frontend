import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewHearingComponent } from './components/view-hearing/view-hearing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { HearingService } from './services/hearing.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NotesModule } from '../notes/notes.module';
import { CreateHearingNoteComponent } from './components/create-hearing-note/create-hearing-note.component';
import { CoreModule } from '../core/core.module';
import { AmendScheduledListingComponent } from './components/amend-scheduled-listing/amend-scheduled-listing.component';

const COMPONENTS = [
  ViewHearingComponent,
  CreateHearingNoteComponent,
  AmendScheduledListingComponent
];

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FormsModule,
    NotesModule,
    CoreModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [HearingService],
  entryComponents: [AmendScheduledListingComponent]
})
export class HearingModule {
}

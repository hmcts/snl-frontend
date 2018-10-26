import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { NotesEffects } from './effects/notes.effects';
import { CoreModule } from '../core/core.module';
import { NotesService } from './services/notes.service';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoteComponent } from './components/note/note.component';
import { NoteListComponent } from './components/notes-list/note-list.component';
import { NotesPreparerService } from './services/notes-preparer.service';
import { NotesListDialogComponent } from './components/notes-list-dialog/notes-list-dialog.component';
import { NotesPopulatorService } from './services/notes-populator.service';

const COMPONENTS = [
    NoteComponent,
    NoteListComponent,
    NotesListDialogComponent
];

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        StoreModule.forFeature('notes', reducers),
        EffectsModule.forFeature([NotesEffects])
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    providers: [NotesService, NotesPreparerService, NotesPopulatorService],
    entryComponents: [NotesListDialogComponent]
})
export class NotesModule {
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { getNoteFromViewModel, Note } from '../../models/note.model';
import { getNoteViewModel, NoteViewmodel } from '../../models/note.viewmodel';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteListComponent {
    public noteViewModels: NoteViewmodel[];

    @Input() set notes(notes: Note[]) {
        this.noteViewModels = notes.map(getNoteViewModel);
    };

    getModifiedNotes(): Note[] {
        return this.noteViewModels.filter(n => n.modified).map(getNoteFromViewModel);
    }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { getNoteFromViewModel, Note } from '../../models/note.model';
import { getNoteViewModel, NoteViewmodel } from '../../models/note.viewmodel';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteListComponent {
    public noteViewModels: NoteViewmodel[];

    @Input() set notes(notes: Note[]) {
        this.noteViewModels = notes.map(getNoteViewModel);
    };

    getModifiedOrNewNotes(): Note[] {
        return this.noteViewModels.filter(this.noteModified).map(getNoteFromViewModel);
    }

    private noteModified(note: NoteViewmodel): boolean {
        return note.modified
    }
}

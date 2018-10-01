import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { getNoteFromViewModel, Note } from '../../models/note.model';
import { NoteViewmodel } from '../../models/note.viewmodel';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteListComponent {
    public noteViewModels: NoteViewmodel[];
    @Input() disabled: boolean;

    @Input() set notes(notes: NoteViewmodel[]) {
        this.noteViewModels = notes;
    };

    getModifiedNotes(): Note[] {
        return this.noteViewModels.filter(n => n.modified).map(getNoteFromViewModel);
    }
}

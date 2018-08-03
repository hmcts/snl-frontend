import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NoteViewmodel } from '../../models/note.viewmodel';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {
    @Input() note: NoteViewmodel;

    content = new FormControl();

    constructor() {
        this.content.valueChanges
            .subscribe( (value) => {
                this.note.modified = true;
                this.note.content = value;
            });
    }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NoteViewmodel } from '../../models/note.viewmodel';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {
    @Input() note: NoteViewmodel;

    content = new FormControl();

    constructor() {
        this.content.valueChanges.pipe(debounceTime(300))
            .subscribe( (value) => {
                this.note.modified = true;
                this.note.content = value;
            });
    }
}

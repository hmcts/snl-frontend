import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { NoteViewmodel } from '../../models/note.viewmodel';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {
    originalContent = null;
    private _note: NoteViewmodel;
    @Input() set note(note: NoteViewmodel) {
        this._note = note;
        this.originalContent = note.content;
    }
    get note(): NoteViewmodel { return this._note };

    @Input() disabled = false;

    content: FormControl;

    ngOnInit(): void {
        this.content = new FormControl({value: '', disabled: this.disabled});
        this.content.valueChanges
            .subscribe((value) => {
                this.note.modified = true;
                this.note.content = value;
                if (this.originalContent === value) {
                    this.note.modified = false;
                }
            });
    }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DEFAULT_NOTE_DATE_FORMAT, NoteViewmodel } from '../../models/note.viewmodel';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {
    content: FormControl;
    originalContent = null;

    private _note: NoteViewmodel;
    @Input() set note(note: NoteViewmodel) {
        this._note = note;
        this.originalContent = note.content;

        this.content = new FormControl({value: note.content, disabled: this.disabled});
        this.content.valueChanges
            .subscribe((value) => {
                this.note.modified = true;
                this.note.content = value;
                if (this.originalContent === value) {
                    this.note.modified = false;
                }
            });
    }
    get note(): NoteViewmodel { return this._note };

    private _disabled = false
    @Input() set disabled(disabled: boolean) {
        this._disabled = disabled
        if (this.content) {
            if (disabled) {
                this.content.disable()
            } else {
                this.content.enable()
            }
        }
    }
    get disable() { return this._disabled }

    protected formatDate(date: moment.Moment) {
        return moment(date).format(DEFAULT_NOTE_DATE_FORMAT)
    }

}

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
    @Input() note: NoteViewmodel;
    @Input() disabled: boolean;

    content: FormControl;

    ngOnInit(): void {
        this.content  = new FormControl({value: '', disabled: this.disabled});
        this.content.valueChanges
            .subscribe( (value) => {
                this.note.modified = true;
                this.note.content = value;
            });
    }
}

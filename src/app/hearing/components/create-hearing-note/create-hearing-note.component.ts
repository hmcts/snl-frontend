
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NoteComponent } from '../../../notes/components/note/note.component';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';

@Component({
    selector: 'app-create-hearing-note',
    templateUrl: './create-hearing-note.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateHearingNoteComponent {
    @Input() note: NoteViewmodel;

    @Output() onSubmit = new EventEmitter();
    @ViewChild(NoteComponent) noteComponent: NoteComponent;

    submit(note: NoteViewmodel) {
        this.onSubmit.emit(note);
    }

    isButtonDisabled() {
        return this.noteComponent.note.content.trim().length === 0;
    }
}

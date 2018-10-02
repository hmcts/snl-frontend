import { Note } from './note.model';
import * as moment from 'moment';

export interface NoteViewmodel extends Note {
    modified: boolean,
    inputLabel: string,
    readonly: boolean,
    displayCreationDetails: boolean
}

export function getNoteViewModel(note: Note): NoteViewmodel {
    return {
        id: note.id,
        content: note.content,
        type: note.type,
        modified: false,
        readonly: false,
        entityId: note.entityId,
        entityType: note.entityType,
        inputLabel: note.type,
        createdAt: moment(note.createdAt).format('DD/MM/YYYY hh:mm'),
        modifiedBy: note.modifiedBy,
        displayCreationDetails: true
    } as NoteViewmodel
}

export function enableDisplayCreationDetails(note: NoteViewmodel) {
    note.displayCreationDetails = true;
    return note;
}

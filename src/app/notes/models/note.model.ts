import { NoteViewmodel } from './note.viewmodel';
import * as moment from 'moment';
import { NoteType } from './note-type';

export interface Note {
  id: string;
  type: string;
  content: string;
  entityId: string;
  entityType: string;
  createdAt: moment.Moment;
  modifiedBy: string;
}

export function getNoteFromViewModel(note: NoteViewmodel): Note {
    return {
        id: note.id,
        content: note.content,
        type: note.type,
        entityId: note.entityId,
        entityType: note.entityType,
        createdAt: note.createdAt,
        modifiedBy: note.modifiedBy
    } as Note
}

export function isOfTypeOtherOrListing(note: Note) {
    return note.type === NoteType.OTHER_NOTE || note.type === NoteType.LISTING_NOTE;
}

export const DEFAULT_NOTE: Note = {
    id: undefined,
    type: undefined,
    content: '',
    entityId: undefined,
    entityType: undefined,
    createdAt: undefined,
    modifiedBy: undefined
}

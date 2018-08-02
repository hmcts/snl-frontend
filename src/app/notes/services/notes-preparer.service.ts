import { Injectable } from '@angular/core';
import { Note } from '../models/note.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class NotesPreparerService {

    constructor() {
    }

    public prepare(notes: Note[], parentId: string, entityName: string): Note[] {
        return notes.map(n => this.generateUUIDIfUndefined(n))
            .map(n => this.assignParentIdIfUndefined(n, parentId))
            .map(n => this.assignEntityName(n, entityName));
    }

    private generateUUIDIfUndefined(note: Note): Note {
        if (this.isLogicallyUndefined(note.id)) {
            note.id = uuid();
        }
        return note;
    }

    private assignParentIdIfUndefined(note: Note, parentId: string): Note {
        if (this.isLogicallyUndefined(note.parentId)) {
            note.parentId = parentId;
        }
        return note;
    }

    private assignEntityName(note: Note, entity: string): Note {
        note.entity = entity;
        return note;
    }

    private isLogicallyUndefined(property: any) {
        return (property === undefined) || (property === '') || (property === null)
    }
}

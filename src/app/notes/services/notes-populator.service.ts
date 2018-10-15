import { Injectable } from '@angular/core';
import { NotesService } from './notes.service';
import { Note } from '../models/note.model';

export enum NoteType {
  SpecialRequirements = 'Special Requirements',
  FacilityRequirements = 'Facility Requirements',
  OtherNote = 'Other note'
}

@Injectable()
export class NotesPopulatorService {
  constructor(private readonly notesService: NotesService) {
  }

  // iterates recursively through the whole object to find where there are any placeholders for notes
  // fetches notes and populates those placeholders
  public async populateWithNotes(o: any) {
    const entityIds = this.collectEntityIds(o, [])

    this.fetchNotes(entityIds).subscribe(
      (notes) => {
        this.populateWithOtherNotes(o, notes.filter(x => x.type === NoteType.OtherNote));
        // those calls are specific for Hearing but if we stick to convention we can use them on other entities
        this.populateWithSingleNote(o, notes, NoteType.SpecialRequirements, 'specialRequirements');
        this.populateWithSingleNote(o, notes, NoteType.FacilityRequirements, 'facilityRequirements');
      }
    )
  }

  private populateWithSingleNote(o: any, notes: Note[], noteType: string, keyToPopulate: string) {
    o[keyToPopulate] = notes.find(x => x.type === noteType && x.entityId === o.id).content;
  }

  // finds every entityId in object recursively and returns array of entityId's
  private collectEntityIds(o: any, entityIds) {
    for (let key in o) {
      if (o.hasOwnProperty(key)) {
        let item = o[key];
        // if there's placeholder for notes, add object id to array
        if (key === 'notes') {
          entityIds.push(o.id);
        }

        // if there's an array of other items, we go deeper to find notes
        if (item instanceof Array) {
          item.map(x => entityIds.concat(this.collectEntityIds(x, entityIds)));
        }
      }
    }

    return entityIds;
  }

  private fetchNotes(ids: string[]) {
    return this.notesService.getByEntities(ids);
  }

  // populates object with notes
  private populateWithOtherNotes(o: any, notes: Note[]) {
    for (let key in o) {
      if (o.hasOwnProperty(key)) {
        let item = o[key];

        // if there's placeholder for notes, we try to match notes we got from NotesService
        if (key === 'notes') {
          o[key] = notes.filter(x => x.entityId === o.id);
        }

        // if there's an array of other items, we go deeper to find note placeholders
        if (item instanceof Array) {
          item.map((x, k) => item[k] = this.populateWithOtherNotes(x, notes));
        }
      }
    }

    return o;
  }
}

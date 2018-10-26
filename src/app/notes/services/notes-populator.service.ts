import { Injectable } from '@angular/core';
import { NotesService } from './notes.service';
import { Note } from '../models/note.model';
import * as moment from 'moment';

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
  public populateWithNotes(entity: any) {
    const entityIds = this.collectEntityIds(entity, [])

    this.fetchNotes(entityIds).subscribe(
      (notes) => {
        this.populateWithOtherNotes(entity, notes.filter(item => item.type === NoteType.OtherNote));
        // those calls are specific for Hearing but if we stick to convention we can use them on other entities
        this.populateWithSingleNote(entity, notes, NoteType.SpecialRequirements, 'specialRequirements');
        this.populateWithSingleNote(entity, notes, NoteType.FacilityRequirements, 'facilityRequirements');
      }
    )
  }

  private populateWithSingleNote(entity: any, notes: Note[], noteType: string, keyToPopulate: string) {
    const note = notes.find(item => item.type === noteType && item.entityId === entity.id);
    if (note !== undefined) {
      entity[keyToPopulate] = note.content;
    }
  }

  // finds every entityId in object recursively and returns array of entityId's
  private collectEntityIds(entity: any, entityIds) {
    for (let key in entity) {
      if (entity.hasOwnProperty(key)) {
        if (key === 'id') {
          entityIds.push(entity.id);
        }

        let item = entity[key];
        // if there's an array of other items, we go deeper to find notes
        if (item instanceof Array) {
          item.forEach(i => entityIds.concat(this.collectEntityIds(i, entityIds)));
        }
      }
    }

    return entityIds;
  }

  private fetchNotes(ids: string[]) {
    return this.notesService.getByEntities(ids);
  }

  // populates object with notes
  private populateWithOtherNotes(entity: any, notes: Note[]) {
    // if there's placeholder for notes, we try to match notes we got from NotesService
    const thisEntityNotes = notes
      .filter(item => item.entityId === entity.id)
      .sort((a, b) => {
        return moment(a.createdAt).isBefore(moment(b.createdAt)) ? 1 : -1
      });

    if (thisEntityNotes.length > 0) {
      entity['notes'] = thisEntityNotes;
    }

    for (let key in entity) {
      if (entity.hasOwnProperty(key)) {
        let item = entity[key];
        // if there's an array of other items, we go deeper to find note placeholders
        if (item instanceof Array) {
          item.forEach((value, k) => item[k] = this.populateWithOtherNotes(value, notes));
        }
      }
    }

    return entity;
  }
}

import { NotesPopulatorService, NoteType } from './notes-populator.service';
import { NotesService } from './notes.service';
import { Observable } from 'rxjs/Observable';

let service: NotesPopulatorService;

const PARENT_ENTITY_ID = 'parent';
const PARENT_ENTITY_NOTE = 'parent note';
const CHILD_ENTITY_ID = 'child';
const CHILD_ENTITY_NOTE = 'child note';
const NO_NOTES_ENTITY_ID = 'no notes';
const GRANDCHILD_ENTITY_ID = 'grandchild';
const GRANDCHILD_ENTITY_NOTE = 'grandchild note';
const UNKNOWN_NOTE_TYPE_ENTITY_ID = 'unknown note type';
const UNKNOWN_NOTE_TYPE_ENTITY_NOTE = 'unknown note type note';
const FACILITY_REQUIREMENTS_NOTE = 'I feel like a common string';
const SPECIAL_REQUIREMENTS_NOTE = 'why I am a note?';

describe('NotesPopulatorService', () => {
  beforeEach(() => {
    service = new NotesPopulatorService(
      {
        getByEntities: function(entitiesIds: string[]) {
          return Observable.of([
            {
              entityId: PARENT_ENTITY_ID,
              content: PARENT_ENTITY_NOTE,
              type: NoteType.OtherNote
            },
            {
              entityId: PARENT_ENTITY_ID,
              content: FACILITY_REQUIREMENTS_NOTE,
              type: NoteType.FacilityRequirements
            },
            {
              entityId: PARENT_ENTITY_ID,
              content: SPECIAL_REQUIREMENTS_NOTE,
              type: NoteType.SpecialRequirements
            },
            {
              entityId: CHILD_ENTITY_ID,
              content: CHILD_ENTITY_NOTE,
              type: NoteType.OtherNote
            },
            // entity on
            {
              entityId: GRANDCHILD_ENTITY_ID,
              content: GRANDCHILD_ENTITY_NOTE,
              type: NoteType.OtherNote
            },
            // this note is not going to be populated as this type is not handled
            {
              entityId: UNKNOWN_NOTE_TYPE_ENTITY_ID,
              content: UNKNOWN_NOTE_TYPE_ENTITY_NOTE,
              type: 'unknown'
            },
          ]);
        }
      } as NotesService
    )
  });

  it('populateWithNotes should populate object with notes', () => {
    const inputEntity = {
      id: PARENT_ENTITY_ID,
      children: [
        {
          id: CHILD_ENTITY_ID,
        },
        {
          id: NO_NOTES_ENTITY_ID,
          someRelatedEntitiesWithNotes: [
            {
              id: GRANDCHILD_ENTITY_ID
            }
          ]
        },
      ]
    };

    const expectedResult = {
      id: PARENT_ENTITY_ID,
      notes: [
        {
          entityId: PARENT_ENTITY_ID,
          content: PARENT_ENTITY_NOTE,
          type: NoteType.OtherNote,
        }
      ],
      facilityRequirements: FACILITY_REQUIREMENTS_NOTE,
      specialRequirements: SPECIAL_REQUIREMENTS_NOTE,
      children: [
        {
          id: CHILD_ENTITY_ID,
          notes: [
            {
              entityId: CHILD_ENTITY_ID,
              content: CHILD_ENTITY_NOTE,
              type: NoteType.OtherNote,
            }
          ],
        },
        {
          id: NO_NOTES_ENTITY_ID,
          someRelatedEntitiesWithNotes: [
            {
              id: GRANDCHILD_ENTITY_ID,
              notes: [
                {
                  entityId: GRANDCHILD_ENTITY_ID,
                  content: GRANDCHILD_ENTITY_NOTE,
                  type: NoteType.OtherNote,
                }
              ],
            }
          ]
        },
      ]
    };

    service.populateWithNotes(inputEntity);

    expect(inputEntity).toEqual(expectedResult);
  });


});
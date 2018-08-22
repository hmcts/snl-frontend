import { Note } from '../../notes/models/note.model';
import { HearingPart } from './hearing-part';

export interface ListingCreate {
    hearingPart: HearingPart;
    notes: Note[]
}

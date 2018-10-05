import { UpdateHearingPartRequest } from './update-hearing-part-request';
import { Note } from '../../notes/models/note.model';

export interface ListingCreate {
    hearingPart: UpdateHearingPartRequest;
    notes: Note[]
}

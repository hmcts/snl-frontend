import { UpdateHearingRequest } from './update-hearing-request';
import { Note } from '../../notes/models/note.model';

export interface ListingCreate {
    hearing: UpdateHearingRequest;
    notes: Note[]
}

export interface ListingRequestViewmodel {
    hearing: UpdateHearingRequest;
    notes: Note[]
}

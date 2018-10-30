import { UpdateHearingRequest } from './update-hearing-request';
import { Note } from '../../notes/models/note.model';

export interface ListingCreate {
    hearing: UpdateHearingRequest;
    notes: Note[]
}

export function isMultiSessionListing(listing: ListingCreate): boolean {
    if (listing && listing.hearing) {
        return listing.hearing.duration.asDays() >= 1;
    } else {
        return false;
    }
}

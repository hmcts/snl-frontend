import { UpdateHearingRequest } from './update-hearing-request';
import { Note } from '../../notes/models/note.model';
import { FilteredHearingViewmodel } from './filtered-hearing-viewmodel';

export interface ListingCreate {
    hearing: UpdateHearingRequest;
    notes: Note[]
}

export interface ListingRequestViewmodel {
    hearing: UpdateHearingRequest;
    notes: Note[]
}

export interface ListingRequestViewmodelForAmendment {
    hearing: FilteredHearingViewmodel;
    notes: Note[]
}

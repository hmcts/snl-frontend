import { UpdateHearingRequest } from './update-hearing-request';
import { Note } from '../../notes/models/note.model';
import { Priority } from './priority-model';

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

export const DEFAULT_LISTING_CREATE: ListingCreate = {
    hearing: {
        id: undefined,
            caseNumber: undefined,
            caseTitle: undefined,
            caseTypeCode: undefined,
            hearingTypeCode: undefined,
            duration: undefined,
            scheduleStart: undefined,
            scheduleEnd: undefined,
            priority: Priority.Low,
            version: 0,
            reservedJudgeId: undefined,
            communicationFacilitator: undefined,
            userTransactionId: undefined,
            numberOfSessions: 1
    },
    notes: []
};

import { ListingCreate } from '../models/listing-create';

export function isMultiSessionListing(listing: ListingCreate): boolean {
    if (listing && listing.hearing) {
        return listing.hearing.duration.asDays() >= 1;
    } else {
        return false;
    }
}

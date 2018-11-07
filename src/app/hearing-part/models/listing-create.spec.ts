import moment = require('moment');
import { isMultiSessionListing, ListingCreate } from './listing-create';

describe('isMultiSessionListing', () => {
    it('should return false for undefined listing', () => {
        const listing = undefined;
        const result = isMultiSessionListing(listing);
        expect(result).toEqual(false);
    });

    it('should return false for undefined listing.hearing', () => {
        const listing = { hearing: undefined } as ListingCreate;
        const result = isMultiSessionListing(listing);
        expect(result).toEqual(false);
    });

    it('should return true for duration longer then a day listing.hearing', () => {
        const listing = { hearing: {
            duration: moment.duration(1441, 'minutes')
        }} as ListingCreate;
        const result = isMultiSessionListing(listing);
        expect(result).toEqual(true);
    });

    it('should return true for duration long as a day listing.hearing', () => {
        const listing = { hearing: {
            duration: moment.duration(1440, 'minutes')
        }} as ListingCreate;
        const result = isMultiSessionListing(listing);
        expect(result).toEqual(true);
    });

    it('should return false for duration shorter then a day listing.hearing', () => {
        const listing = { hearing: {
                duration: moment.duration(1439, 'minutes')
            }} as ListingCreate;
        const result = isMultiSessionListing(listing);
        expect(result).toEqual(false);
    });

});

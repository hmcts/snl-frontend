export interface ListingDetailsOptions {
    unlisted: boolean,
    partListed: boolean,
    fullyListed: boolean,
    overListed: boolean,
    customListed: {
        checked: boolean,
        from?: number,
        to?: number,
    }
}

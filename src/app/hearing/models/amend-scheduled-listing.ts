export interface AmendScheduledListing {
    userTransactionId: string,
    hearingPartId: string,
    hearingPartVersion: number,
    startTime: string
}

export interface AmendScheduledListingData {
    startTime: string
}

export const DEFAULT_AMEND_SCHEDULED_LISTING: AmendScheduledListing = {
    userTransactionId: undefined,
    hearingPartId: undefined,
    hearingPartVersion: undefined,
    startTime: undefined
}

export const DEFAULT_AMEND_SCHEDULED_LISTING_DATA: AmendScheduledListingData = {
    startTime: undefined
}

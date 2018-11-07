import { fromString, Status } from './status.model';

export interface StatusConfigEntry {
    status: Status;
    canBeListed: boolean;
    canBeUnlisted: boolean;
}

export interface StatusConfigEntryResponse {
    status: string;
    canBeListed: boolean;
    canBeUnlisted: boolean;
}

export function fromResponse(statusConfigEntryResponse: StatusConfigEntryResponse): StatusConfigEntry {
    return {
        ...statusConfigEntryResponse,
        status: fromString(statusConfigEntryResponse.status)
    }
}

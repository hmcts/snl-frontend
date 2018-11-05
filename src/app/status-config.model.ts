import { Status } from './status.model';

export interface StatusConfig {
    entries: StatusConfigEntry[];
}

export interface StatusConfigEntry {
    status: Status;
    canBeListed: boolean;
    canBeUnlisted: boolean;
}

import { CreateHearingRequest } from './create-hearing-request';

export interface UpdateHearingRequest extends CreateHearingRequest {
    version: number;
    isListed?: boolean;
}

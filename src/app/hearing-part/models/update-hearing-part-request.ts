import { CreateHearingPartRequest } from './create-hearing-part-request';

export interface UpdateHearingPartRequest extends CreateHearingPartRequest {
    version: number;
}

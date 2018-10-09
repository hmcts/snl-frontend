import { Hearing } from './hearing';

export interface HearingPartResponse {
    id: string;
    sessionId?: string;
    hearingInfo: Hearing;
}

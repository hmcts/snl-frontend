import { Status } from './../../core/reference/models/status.model';
export interface HearingPart {
    id: string;
    sessionId?: string;
    version: number;
    hearingInfo: string;
    start: string;
    status: Status
 }

import { Judge } from '../../judges/models/judge.model';
import { Room } from '../../rooms/models/room.model';
import * as moment from 'moment';
import { HearingPartViewModel } from '../../hearing-part/models/hearing-part.viewmodel';
import { SessionType } from '../../core/reference/models/session-type';
import { Note } from '../../notes/models/note.model';

export interface SessionViewModel {
    id: string;
    start: moment.Moment;
    duration: number;
    room: Room;
    person: Judge;
    sessionType: SessionType;
    hearingParts: HearingPartViewModel[];
    jurisdiction: string;
    version: number;
    allocated: moment.Duration;
    utilization: number;
    available: moment.Duration;
    notes: Note[]
}

export interface SessionForListingResponse {
    sessionId: string;
    personId: string;
    personName: string;
    roomId: string;
    roomName: string;
    sessionTypeCode: string;
    sessionTypeDescription: string;
    startTime: string;
    startDate: string;
    duration: string;
    noOfHearingPartsAssignedToSession: number;
    allocatedDuration: string;
    utilisation: number;
    available: string;
}

export interface SessionForListing {
    sessionId: string;
    personId: string;
    personName: string;
    roomId: string;
    roomName: string;
    sessionTypeCode: string;
    sessionTypeDescription: string;
    startTime: moment.Moment;
    startDate: moment.Moment;
    duration: moment.Duration;
    noOfHearingPartsAssignedToSession: number;
    allocatedDuration: moment.Duration;
    utilisation: number;
    available: moment.Duration;
}

export interface SessionForListingWithNotes {
    sessionId: string;
    personId: string;
    personName: string;
    roomId: string;
    roomName: string;
    sessionTypeCode: string;
    sessionTypeDescription: string;
    startTime: moment.Moment;
    startDate: moment.Moment;
    duration: moment.Duration;
    noOfHearingPartsAssignedToSession: number;
    allocatedDuration: moment.Duration;
    utilisation: number;
    available: moment.Duration;
    notes: Note[]
}

export function mapResponseToSessionForListing(s: SessionForListingResponse) {
    const sessionForListing: SessionForListing = {
        sessionId: s.sessionId,
        personId: s.personId,
        personName: s.personName,
        roomId: s.roomId,
        roomName: s.roomName,
        sessionTypeCode: s.sessionTypeCode,
        sessionTypeDescription: s.sessionTypeDescription,
        startTime: moment(s.startTime),
        startDate: moment(s.startDate),
        duration: moment.duration(s.duration),
        noOfHearingPartsAssignedToSession: s.noOfHearingPartsAssignedToSession,
        allocatedDuration: moment.duration(s.allocatedDuration),
        utilisation: s.utilisation,
        available: moment.duration(s.available),
    }

    return sessionForListing;
}
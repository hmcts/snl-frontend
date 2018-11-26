import { SessionsStatisticsService } from './sessions-statistics-service';
import { SessionViewModel } from '../models/session.viewmodel';
import * as moment from 'moment';
import { Priority } from '../../hearing-part/models/priority-model';
import { HearingPartViewModel } from '../../hearing-part/models/hearing-part.viewmodel';

let sessionsStatisticsService: SessionsStatisticsService;
let session: SessionViewModel;

function createHearingPart(duration: moment.Duration = moment.duration('PT20M')) {
    return {
        id: undefined,
        sessionId: undefined,
        caseNumber: undefined,
        caseTitle: undefined,
        caseType: undefined,
        hearingType: undefined,
        duration: duration,
        scheduleStart: undefined,
        scheduleEnd: undefined,
        notes: [],
        version: undefined,
        priority: Priority.Low,
        reservedJudgeId: undefined,
        reservedJudge: undefined,
        communicationFacilitator: undefined
    } as HearingPartViewModel;
}

describe('SessionsStatisticsService', () => {
    beforeAll(() => {
        sessionsStatisticsService = new SessionsStatisticsService();
    });

    describe('calculateAllocatedHearingsDuration', () => {
        it('should give one hearing part duration given session with one hearing', () => {
            session = {
                id: undefined,
                start: undefined,
                duration: 10,
                room: undefined,
                person: undefined,
                sessionType: undefined,
                hearingParts: [createHearingPart()],
                jurisdiction: undefined,
                version: undefined,
                allocated: undefined,
                utilization: undefined,
                available: undefined,
                notes: []
            };
            expect(sessionsStatisticsService.calculateAllocatedHearingsDuration(session))
                .toEqual(moment.duration('PT20M'));
        });

        it('should accumulate multiple hearing parts duration', () => {
            session = {
                id: undefined,
                start: undefined,
                duration: 10,
                room: undefined,
                person: undefined,
                sessionType: undefined,
                hearingParts: [
                    createHearingPart(moment.duration('PT20M')),
                    createHearingPart(moment.duration('PT10M')),
                    createHearingPart(moment.duration('PT1H'))
                ],
                jurisdiction: undefined,
                version: undefined,
                allocated: undefined,
                utilization: undefined,
                available: undefined,
                notes: []
            };
            expect(sessionsStatisticsService.calculateAllocatedHearingsDuration(session))
                .toEqual(moment.duration('PT1H30M'));
        });

        it('should give 0 given session without hearings', () => {
            session = {
                id: undefined,
                start: undefined,
                duration: 10,
                room: undefined,
                person: undefined,
                sessionType: undefined,
                hearingParts: [],
                jurisdiction: undefined,
                version: undefined,
                allocated: undefined,
                utilization: undefined,
                available: undefined,
                notes: []
            };
            expect(sessionsStatisticsService.calculateAllocatedHearingsDuration(session))
                .toEqual(moment.duration(0));
        });

        it('should return session duration when hearing parts belongs to multi session hearing', () => {
            const hearingPart = createHearingPart(moment.duration('PT20M'));
            const sessionDurationInMinutes = 10
            hearingPart.multiSession = true;
            session = {
                id: undefined,
                start: undefined,
                duration: sessionDurationInMinutes,
                room: undefined,
                person: undefined,
                sessionType: undefined,
                hearingParts: [hearingPart],
                jurisdiction: undefined,
                version: undefined,
                allocated: undefined,
                utilization: undefined,
                available: undefined,
                notes: []
            };
            expect(sessionsStatisticsService.calculateAllocatedHearingsDuration(session))
                .toEqual(moment.duration(sessionDurationInMinutes));
        });

        describe('when session has two hearing parts. One multi and one single', () => {
            it('calculated duration should equal = session duration (as there is 1 multi session hp) + duration of single hp', () => {
                const sessionDuration = moment.duration('PT10M').asMilliseconds()
                const multiHearingPart = createHearingPart(moment.duration('PT40M'));
                multiHearingPart.multiSession = true;

                const hearingPart = createHearingPart(moment.duration('PT20M'));

                const expectedDuration = 'PT30M' // 'PT10M' [sessionDuration] + 'PT20M' [single hearing part duration]

                session = {
                    id: undefined,
                    start: undefined,
                    duration: sessionDuration,
                    room: undefined,
                    person: undefined,
                    sessionType: undefined,
                    hearingParts: [multiHearingPart, hearingPart],
                    jurisdiction: undefined,
                    version: undefined,
                    allocated: undefined,
                    utilization: undefined,
                    available: undefined,
                    notes: []
                };
                expect(sessionsStatisticsService.calculateAllocatedHearingsDuration(session))
                    .toEqual(moment.duration(expectedDuration));
            });
        });
    });

    describe('calculateUtilizedDuration', () => {
        it('should calculate 50% of utilization', () => {
            expect(sessionsStatisticsService.calculateUtilizedDuration(moment.duration('PT1H'), moment.duration('PT30M')))
                .toEqual(50);
        });

        it('should calculate 100% of utilization', () => {
            expect(sessionsStatisticsService.calculateUtilizedDuration(moment.duration('PT1H'), moment.duration('PT1H')))
                .toEqual(100);
        });

        it('should calculate 0% of utilization', () => {
            expect(sessionsStatisticsService.calculateUtilizedDuration(moment.duration('PT1H'), moment.duration(0)))
                .toEqual(0);
        });

        it('should throw error when params are undefined', () => {
            expect(() => {
                sessionsStatisticsService.calculateUtilizedDuration(undefined, undefined);
            }).toThrow();
        });
    });

    describe('calculateAvailableDuration', () => {
        it('should give 0 when not available', () => {
            expect(sessionsStatisticsService.calculateAvailableDuration(moment.duration('PT1H'), moment.duration('PT2H')))
                .toEqual(moment.duration('PT0H'));
        });

        it('should give correct value when available', () => {
            expect(sessionsStatisticsService.calculateAvailableDuration(moment.duration('PT1H'), moment.duration('PT30M')))
                .toEqual(moment.duration('PT30M'));
        });

        it('should throw error when params are undefined', () => {
            expect(() => {
                sessionsStatisticsService.calculateAvailableDuration(undefined, undefined);
            }).toThrow();
        });
    });
});

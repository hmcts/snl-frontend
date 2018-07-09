import { SessionsStatisticsService } from './sessions-statistics-service';
import { SessionViewModel } from '../models/session.viewmodel';
import * as moment from 'moment';
import { HearingPart } from '../../hearing-part/models/hearing-part';

let sessionsStatisticsService: SessionsStatisticsService;
let session: SessionViewModel;

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
                caseType: undefined,
                hearingParts: [{
                    id: undefined,
                    session: undefined,
                    caseNumber: undefined,
                    caseTitle: undefined,
                    caseType: undefined,
                    hearingType: undefined,
                    duration: moment.duration('PT20M'),
                    scheduleStart: undefined,
                    scheduleEnd: undefined
                }] as [HearingPart],
                jurisdiction: undefined
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
                caseType: undefined,
                hearingParts: [{
                    id: undefined,
                    session: undefined,
                    caseNumber: undefined,
                    caseTitle: undefined,
                    caseType: undefined,
                    hearingType: undefined,
                    duration: moment.duration('PT20M'),
                    scheduleStart: undefined,
                    scheduleEnd: undefined
                }, {
                    id: undefined,
                    session: undefined,
                    caseNumber: undefined,
                    caseTitle: undefined,
                    caseType: undefined,
                    hearingType: undefined,
                    duration: moment.duration('PT10M'),
                    scheduleStart: undefined,
                    scheduleEnd: undefined
                }, {
                    id: undefined,
                    session: undefined,
                    caseNumber: undefined,
                    caseTitle: undefined,
                    caseType: undefined,
                    hearingType: undefined,
                    duration: moment.duration('PT1H'),
                    scheduleStart: undefined,
                    scheduleEnd: undefined
                }] as HearingPart[],
                jurisdiction: undefined
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
                caseType: undefined,
                hearingParts: [] as [HearingPart],
                jurisdiction: undefined
            };
            expect(sessionsStatisticsService.calculateAllocatedHearingsDuration(session))
                .toEqual(moment.duration(0));
        });
    });

    describe('calculateUtilizedDuration', () => {
        it('should calculate 50% of utilization', function () {
            expect(sessionsStatisticsService.calculateUtilizedDuration(moment.duration('PT1H'), moment.duration('PT30M')))
                .toEqual(50);
        });

        it('should calculate 100% of utilization', function () {
            expect(sessionsStatisticsService.calculateUtilizedDuration(moment.duration('PT1H'), moment.duration('PT1H')))
                .toEqual(100);
        });

        it('should calculate 0% of utilization', function () {
            expect(sessionsStatisticsService.calculateUtilizedDuration(moment.duration('PT1H'), moment.duration(0)))
                .toEqual(0);
        });

        it('should throw error when params are undefined', function () {
            expect(function () {
                sessionsStatisticsService.calculateUtilizedDuration(undefined, undefined)
            }).toThrow();
        });
    });

    describe('calculateAvailableDuration', () => {
        it('should give 0 when not available', function () {
            expect(sessionsStatisticsService.calculateAvailableDuration(moment.duration('PT1H'), moment.duration('PT2H')))
                .toEqual(0);
        });
    });

    describe('calculateAvailableDuration', () => {
        it('should give correct value when available', function () {
            expect(sessionsStatisticsService.calculateAvailableDuration(moment.duration('PT1H'), moment.duration('PT30M')))
                .toEqual(30);
        });
    });

    describe('calculateAvailableDuration', () => {
        it('should throw error when params are undefined', function () {
            expect(function() {
                sessionsStatisticsService.calculateAvailableDuration(undefined, undefined)
            }).toThrow();
        });
    });
});

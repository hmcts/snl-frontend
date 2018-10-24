import { HearingDeletion } from '../models/hearing-deletion';
import {
    AssignToSession, Create,
    CreateComplete,
    CreateFailed,
    CreateListingRequest,
    Delete, GetById,
    HearingActionTypes, Search, SearchFailed,
    UpdateListingRequest
} from './hearing.action';
import { HearingToSessionAssignment } from '../models/hearing-to-session-assignment';
import { ListingCreate } from '../models/listing-create';
import * as moment from 'moment';
import { Priority } from '../models/priority-model';
import { CreateHearingRequest } from '../models/create-hearing-request';
import { HearingPart } from '../models/hearing-part';

describe('HearingAction', () => {
    describe('Delete hearing', () => {
        it('should create an action', () => {
            const payload: HearingDeletion = {
                userTransactionId: '123',
                hearingId: '123',
                hearingVersion: 1,
            };
            const action = new Delete(payload);

            expect({ ...action }).toEqual({
                type: HearingActionTypes.Delete,
                payload,
            });
        });
    });

    describe('Assing to session', () => {
        it('should create an action', () => {
            const payload: HearingToSessionAssignment = {
                userTransactionId: '123',
                start: new Date(),
                hearingId: '123',
                hearingVersion: 1,
                sessionsData: [
                    {
                        sessionVersion: 1,
                        sessionId: '123'
                    }
                ]
            };
            const action = new AssignToSession(payload);

            expect({ ...action }).toEqual({
                type: HearingActionTypes.AssignToSession,
                payload,
            });
        });
    });

    describe('Create failed', () => {
        it('should create an action', () => {
            const payload = 'delete';
            const action = new CreateFailed(payload);

            expect({ ...action }).toEqual({
                type: HearingActionTypes.CreateFailed,
                payload,
            });
        });
    });

    describe('Create complete', () => {
        it('should create an action', () => {
            const action = new CreateComplete();

            expect({ ...action }).toEqual({
                type: HearingActionTypes.CreateComplete
            });
        });
    });

    describe('Create complete', () => {
        it('should create an action', () => {
            const action = new CreateComplete();

            expect({ ...action }).toEqual({
                type: HearingActionTypes.CreateComplete,
            });
        });
    });

    describe('Update listing request', () => {
        it('should create an action', () => {
            const payload: ListingCreate = {
                hearing: {
                    id: '123',
                    caseNumber: 'caseNum',
                    caseTitle: 'title',
                    caseTypeCode: 'caseType',
                    hearingTypeCode: 'hearingType',
                    duration: moment.duration(),
                    scheduleStart: moment(moment.now()),
                    scheduleEnd: moment(moment.now()),
                    priority: Priority.Low,
                    reservedJudgeId: 'john',
                    communicationFacilitator: '123',
                    userTransactionId: '123',
                    version: 1
                },
                notes: []
            };
            const action = new UpdateListingRequest(payload);

            expect({ ...action }).toEqual({
                type: HearingActionTypes.UpdateListingRequest,
                payload
            });
        });
    });

    describe('Create listing request', () => {
        it('should create an action', () => {
            const payload: CreateHearingRequest = {
                id: '123',
                caseNumber: 'caseNum',
                caseTitle: 'caseTitle',
                caseTypeCode: 'caseType',
                hearingTypeCode: 'hearingType',
                duration: moment.duration(),
                scheduleStart: moment(moment.now()),
                scheduleEnd: moment(moment.now()),
                priority: Priority.Low,
                reservedJudgeId: 'judge',
                communicationFacilitator: 'translator',
                userTransactionId: '123'
            };
            const action = new CreateListingRequest(payload);

            expect({ ...action }).toEqual({
                type: HearingActionTypes.CreateListingRequest,
                payload
            });
        });
    });

    describe('Create', () => {
        it('should create an action', () => {
            const payload: HearingPart = {
                id: '123',
                sessionId: '213',
                version: 1,
                hearingInfo: 'some info'
            };
            const action = new Create(payload);

            expect({ ...action }).toEqual({
                type: HearingActionTypes.Create,
                payload
            });
        });
    });

    describe('Search failed', () => {
        it('should create an action', () => {
            const payload = 'failed';
            const action = new SearchFailed(payload);

            expect({ ...action }).toEqual({
                type: HearingActionTypes.SearchFailed,
                payload
            });
        });
    });

    describe('Get by id', () => {
        it('should create an action', () => {
            const payload = '123';
            const action = new GetById(payload);

            expect({ ...action }).toEqual({
                type: HearingActionTypes.GetById,
                payload
            });
        });
    });

    describe('Search', () => {
        it('should create an action', () => {
            const payload = {id: '123'};
            const action = new Search(payload);

            expect({ ...action }).toEqual({
                type: HearingActionTypes.Search,
                payload
            });
        });
    });
});

import { Observable } from 'rxjs/Observable';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import * as moment from 'moment';
import { Priority, priorityValue } from '../../models/priority-model';
import { HearingsTableComponent } from './hearings-table.component';
import { DEFAULT_HEARING_FOR_LISTING_WITH_NOTES, HearingForListingWithNotes } from '../../models/hearing-for-listing-with-notes.model';
import { Note } from '../../../notes/models/note.model';
import { NoteType } from '../../../notes/models/note-type';

const openDialogMockObjConfirmed = {
    afterClosed: (): Observable<{confirmed: boolean}> => Observable.of({confirmed: true})
};
const now = moment();
const openDialogMockObjDeclined = {
    afterClosed: (): Observable<{confirmed: boolean}> => Observable.of({confirmed: false})
};
let matDialogSpy;
let hearingService: any;
let component: HearingsTableComponent;

describe('HearingsTableComponent', () => {
    beforeEach(() => {
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        hearingService = jasmine.createSpyObj('hearingService', ['deleteHearing']);
        component = new HearingsTableComponent(matDialogSpy, hearingService);

        component.hearings = [generateHearings('123')];
    });

    describe('Initial state ', () => {
        it('should have hearings initialized', () => {
            expect(component._hearings[0]).toEqual(generateHearings('123'));
        });
    });

    describe('Component ', () => {
        it('hasNotes should properly verify notes of hearingparts', () => {
            let hasNotes = component.hasNotes(generateHearings('asd'));

            expect(hasNotes).toBeFalsy();
        });

        it('hasNotes should return true when hearing contains listing note type', () => {
            let hearingWithNotes = {
                ...DEFAULT_HEARING_FOR_LISTING_WITH_NOTES,
                notes: [generateNote(NoteType.LISTING_NOTE), generateNote(NoteType.OTHER_NOTE)]
            };
            let hasNotes = component.hasNotes(hearingWithNotes);
            expect(hasNotes).toBeTruthy();
        });

        it('hasNotes should return true when hearing contains facility requirement note type', () => {
            let hearingWithNotes = {
                ...DEFAULT_HEARING_FOR_LISTING_WITH_NOTES,
                notes: [generateNote(NoteType.FACILITY_REQUIREMENTS)]
            };
            let hasNotes = component.hasNotes(hearingWithNotes);
            expect(hasNotes).toBeTruthy();
        });

        it('hasNotes should return true when hearing contains special requirement note type', () => {
            let hearingWithNotes = {
                ...DEFAULT_HEARING_FOR_LISTING_WITH_NOTES,
                notes: [generateNote(NoteType.SPECIAL_REQUIREMENTS)]
            };
            let hasNotes = component.hasNotes(hearingWithNotes);
            expect(hasNotes).toBeTruthy();
        });

        it('confirming on delete dialog should call service method', () => {
            matDialogSpy.open.and.returnValue(openDialogMockObjConfirmed);

            component.openDeleteDialog({...generateHearings('asd'), caseNumber: '123'});

            expect(matDialogSpy.open).toHaveBeenCalled();
            expect(hearingService.deleteHearing).toHaveBeenCalled();
        });

        it('confirming on edit dialog should call service method', () => {
            let emitSpy = spyOn(component.onEdit, 'emit');
            component.openEditDialog('asd');

            expect(emitSpy).toHaveBeenCalled();
        });

        it('declining on delete dialog should not call service method', () => {
            matDialogSpy.open.and.returnValue(openDialogMockObjDeclined);

            component.openDeleteDialog({...generateHearings('asd'), caseNumber: '123'});

            expect(matDialogSpy.open).toHaveBeenCalled();
            expect(hearingService.deleteHearing).not.toHaveBeenCalled();
        });

        describe('Implementation check of sortingDataAccessor on displayedColumns to sort with proper data ', () => {
            const sampleHearing = {
                id: '-1',
                sessionId: null,
                caseNumber: 'cn-123',
                caseTitle: 'ctitle-123',
                caseType: {code: 'ct-code', description: 'ct-description'} as CaseType,
                hearingType: {code: 'ht-code', description: 'ht-description'} as HearingType,
                duration: moment.duration('PT10M'),
                scheduleStart: now,
                scheduleEnd: now,
                version: 0,
                priority: Priority.Low,
                reservedJudgeId: '0',
                reservedJudge: {id: 'id', name: 'judge-name'},
                communicationFacilitator: 'cf',
                notes: [],
                isListed: false,
                numberOfSessions: 1,
                multiSession: false
            } as HearingForListingWithNotes;

            const displayedColumnsExpectedValues = [
                {columnName: 'case_number', expected: sampleHearing.caseNumber},
                {columnName: 'case_title', expected: sampleHearing.caseTitle},
                {columnName: 'case_type_description', expected: sampleHearing.caseType.description},
                {columnName: 'hearing_type_description', expected: sampleHearing.hearingType.description},
                {columnName: 'duration', expected: sampleHearing.duration.asMilliseconds()},
                {columnName: 'communication_facilitator', expected: sampleHearing.communicationFacilitator},
                {columnName: 'priority', expected: priorityValue(sampleHearing.priority)},
                {columnName: 'reserved_judge_name', expected: sampleHearing.reservedJudge.name},
                {columnName: 'number_of_sessions', expected: sampleHearing.numberOfSessions},
                {columnName: 'notes', expected: 'No'},
                {columnName: 'schedule_start', expected: sampleHearing.scheduleStart.unix()},
                {columnName: 'schedule_end', expected: sampleHearing.scheduleEnd.unix()},
                {columnName: 'select_hearing', expected: undefined},
                {columnName: 'delete', expected: undefined},
                {columnName: 'editor', expected: undefined},
            ];

            it(' tested columns should equal component displayedColumns field', () => {
                const columnsArray: string[] = displayedColumnsExpectedValues.map(r => r.columnName);
                expect(component.displayedColumns).toEqual(columnsArray);
            });
        });
    });
});

function generateHearings(id: string): HearingForListingWithNotes {
    return {...DEFAULT_HEARING_FOR_LISTING_WITH_NOTES, id}
}

function generateNote(type: NoteType): Note {
    return {
        id: 'id',
        type: type,
        content: '',
        entityId: '',
        entityType: '',
        createdAt: now,
        modifiedBy: ''
    } as Note;
}

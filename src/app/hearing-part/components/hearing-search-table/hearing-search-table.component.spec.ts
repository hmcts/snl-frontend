import { HearingSearchTableComponent } from './hearing-search-table.component';
import { MatPaginator } from '@angular/material';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import * as moment from 'moment';
import { Priority, priorityValue } from '../../models/priority-model';
import { HearingViewmodel } from '../../models/hearing.viewmodel';
import { FilteredHearingViewmodel } from '../../models/filtered-hearing-viewmodel';
import { Observable } from 'rxjs/Observable';

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
const now = moment();
let component: HearingSearchTableComponent;
let displayedColumnsExpectedValues;
let sampleHearingPart;

sampleHearingPart = {
    id: '-1',
    caseNumber: 'cn-123',
    caseTitle: 'ctitle-123',
    caseType: { code: 'ct-code', description: 'ct-description' } as CaseType,
    hearingType: { code: 'ht-code', description: 'ht-description' } as HearingType,
    duration: moment.duration('PT10M'),
    scheduleStart: now,
    scheduleEnd: now,
    version: 0,
    priority: Priority.Low,
    reservedJudgeId: '0',
    reservedJudge: { name: 'judge-name'},
    communicationFacilitator: 'cf',
    notes: [],
    isListed: true
} as HearingViewmodel;

displayedColumnsExpectedValues = [
    { columnName: 'caseNumber', expected: sampleHearingPart.caseNumber },
    { columnName: 'caseTitle', expected: sampleHearingPart.caseTitle },
    { columnName: 'priority', expected: priorityValue(sampleHearingPart.priority) },
    { columnName: 'caseType', expected: sampleHearingPart.caseType.description },
    { columnName: 'hearingType', expected: sampleHearingPart.hearingType.description },
    { columnName: 'communicationFacilitator', expected: sampleHearingPart.communicationFacilitator },
    { columnName: 'reservedJudge', expected: sampleHearingPart.reservedJudge.name },
    { columnName: 'requestStatus', expected: 'listed' },
    { columnName: 'listingDate', expected: sampleHearingPart.scheduleStart.unix() }
];

describe('HearingSearchTableComponent', () => {
  beforeEach(() => {
    component = new HearingSearchTableComponent(matDialogSpy);
    component.paginator = {
        page: Observable.of({})
    } as MatPaginator;
    component.hearings = [generateHearing('123')];
  });

  describe('Initial state ', () => {
    it('should include priority', () => {
      expect(component.hearings[0]).toEqual(generateHearing('123'));
    });
  });

  describe('', () => {
    it('should define datasource', () => {
        component.ngOnInit();

        expect(component.dataSource).toBeDefined();
    });

    describe('Implementation check of sortingDataAccessor on displayedColumns to sort with proper data ', () => {

        it(' tested columns should equal component displayedColumns field', () => {
            const columnsArray: string[] = [...displayedColumnsExpectedValues,
                { columnName: 'delete', expected: undefined },
                { columnName: 'amend', expected: undefined }].map(r => r.columnName);
            expect(component.displayedColumns).toEqual(columnsArray);
        });
    });
  });

    describe('buildViewHearingUrl', () => {
        it('should build correct url', () => {
            expect(component.buildViewHearingUrl('random-id')).toEqual('/home/hearing/random-id');
        })
    });

    describe('amend', () => {
        it('should call onAmend callback', () => {
            let onAmendSpy = spyOn(component.onAmend, 'emit');

            component.amend('id');

            expect(onAmendSpy).toHaveBeenCalledWith('id')
        })
    });

    describe('delete', () => {
        it('should call onDelete callback', () => {
            let onDeleteSpy = spyOn(component.onDelete, 'emit');
            let deleteObject = undefined;

            component.delete(deleteObject);

            expect(onDeleteSpy).toHaveBeenCalledWith(deleteObject)
        })
    });
});

function generateHearing(id: string): FilteredHearingViewmodel {
    return {
        id: id,
        caseNumber: null,
        caseTitle: null,
        caseTypeCode: '',
        caseTypeDescription: '',
        hearingTypeCode: '',
        hearingTypeDescription: '',
        duration: null,
        scheduleStart: null,
        scheduleEnd: null,
        version: null,
        priority: null,
        communicationFacilitator: null,
        reservedJudgeId: null,
        reservedJudgeName: null,
        isListed: true,
        listingDate: null,
        personName: ''
    }
}

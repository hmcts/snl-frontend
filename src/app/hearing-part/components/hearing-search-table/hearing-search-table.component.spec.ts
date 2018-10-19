import { StoreModule } from '@ngrx/store';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import * as fromHearingParts from '../../reducers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NoteComponent } from '../../../notes/components/note/note.component';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { DurationFormatPipe } from '../../../core/pipes/duration-format.pipe';
import * as judgesReducers from '../../../judges/reducers';
import { DurationAsMinutesPipe } from '../../../core/pipes/duration-as-minutes.pipe';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { HearingSearchTableComponent } from './hearing-search-table.component';
import { MatDialog } from '@angular/material';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import * as moment from 'moment';
import { Priority, priorityValue } from '../../models/priority-model';
import { HearingModificationService } from '../../services/hearing-modification.service';
import { HearingViewmodel } from '../../models/hearing.viewmodel';

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
const now = moment();
let hpms: HearingModificationService;
let component: HearingSearchTableComponent;
let fixture: ComponentFixture<HearingSearchTableComponent>;
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
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        StoreModule.forFeature('judges', judgesReducers.reducers),
        BrowserAnimationsModule
      ],
      declarations: [
        HearingSearchTableComponent,
        NoteComponent,
        NoteListComponent,
        DurationFormatPipe,
        DurationAsMinutesPipe,
        TransactionDialogComponent
      ],
      providers: [
        NoteListComponent,
        NotesPreparerService,
        ListingCreateNotesConfiguration,
        HearingModificationService,
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
        set: {
            entryComponents: [TransactionDialogComponent]
        }
    });

    fixture = TestBed.createComponent(HearingSearchTableComponent);
    component = fixture.componentInstance;
    hpms = TestBed.get(HearingModificationService);
    spyOn(hpms, 'deleteHearing');
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
                { columnName: 'amend', expected: undefined }].map(r => r.columnName);
            expect(component.displayedColumns).toEqual(columnsArray);
        });

        for (let testCase of displayedColumnsExpectedValues) {
            it(`${testCase.columnName} should return proper value`, () => {
                const expected = testCase.expected;

                component.ngOnChanges();
                const result = component.dataSource.sortingDataAccessor(sampleHearingPart, testCase.columnName);

                expect(result).toBe(expected);
            });
        }
    });
  });
});

function generateHearing(id: string): HearingViewmodel {
    return {
        id: id,
        caseNumber: null,
        caseTitle: null,
        caseType: { code: '', description: '' } as CaseType,
        hearingType: { code: '', description: '' } as HearingType,
        duration: null,
        scheduleStart: null,
        scheduleEnd: null,
        notes: [],
        version: null,
        priority: null,
        communicationFacilitator: null,
        reservedJudgeId: null,
        reservedJudge: null,
        isListed: true
    }
}

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
import * as transactionsReducers from '../../../features/transactions/reducers';
import { DurationAsMinutesPipe } from '../../../core/pipes/duration-as-minutes.pipe';
import { HearingModificationService } from '../../services/hearing-modification.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { HearingPartsPreviewComponent } from './hearing-parts-preview.component';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import * as moment from 'moment';
import { Priority, priorityValue } from '../../models/priority-model';
import { HearingViewmodel } from '../../models/hearing.viewmodel';

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
const openDialogMockObjConfirmed = {
    afterClosed: (): Observable<boolean> => Observable.of(true)
};
const now = moment();
const openDialogMockObjDeclined = {
    afterClosed: (): Observable<boolean> => Observable.of(false)
};
let hpms: HearingModificationService;
let component: HearingPartsPreviewComponent;
let fixture: ComponentFixture<HearingPartsPreviewComponent>;

describe('HearingPartPreviewComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('hearingParts', fromHearingParts.reducers),
        StoreModule.forFeature('judges', judgesReducers.reducers),
        StoreModule.forFeature('transactions', transactionsReducers.reducers),
        BrowserAnimationsModule
      ],
      declarations: [
        HearingPartsPreviewComponent,
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

    fixture = TestBed.createComponent(HearingPartsPreviewComponent);
    component = fixture.componentInstance;
    // store = TestBed.get(Store);
    hpms = TestBed.get(HearingModificationService);
    spyOn(hpms, 'deleteHearing');
    // storeSpy = spyOn(store, 'dispatch').and.callThrough();
    component.hearings = [generateHearingParts('123')];
  });

  describe('Initial state ', () => {
    it('should include priority', () => {
      expect(component.hearings[0]).toEqual(generateHearingParts('123'));
    });
  });

  describe('', () => {
    it('should define datasource', () => {
        component.ngOnInit()

        expect(component.dataSource).toBeDefined();
    });

    it('has notes should properly verify notes of hearingparts', () => {
        let hasNotes = component.hasNotes(generateHearingParts('asd'));

        expect(hasNotes).toBeFalsy();
    });

    it('confirming on delete dialog should call service method', () => {
        matDialogSpy.open.and.returnValue(openDialogMockObjConfirmed);

        component.openDeleteDialog({...generateHearingParts('asd'), caseNumber: '123'});

        expect(matDialogSpy.open).toHaveBeenCalled();
        expect(hpms.deleteHearing).toHaveBeenCalled();
    });

    it('confirming on edit dialog should call service method', () => {
        matDialogSpy.open.and.returnValue(openDialogMockObjConfirmed);

        component.openEditDialog({...generateHearingParts('asd'), caseNumber: '123'});

        expect(matDialogSpy.open).toHaveBeenCalled();

    });

    it('declining on delete dialog should not call service method', () => {
        matDialogSpy.open.and.returnValue(openDialogMockObjDeclined);

        component.openEditDialog({...generateHearingParts('asd'), caseNumber: '123'});

        expect(matDialogSpy.open).toHaveBeenCalled();
        expect(hpms.deleteHearing).not.toHaveBeenCalled();
    });

    it('declining on edit dialog should not call service method', () => {
        matDialogSpy.open.and.returnValue(openDialogMockObjDeclined);

        component.openEditDialog({...generateHearingParts('asd'), caseNumber: '123'});

        expect(matDialogSpy.open).toHaveBeenCalled();
        expect(hpms.deleteHearing).not.toHaveBeenCalled();
    });

    describe('Implementation check of sortingDataAccessor on displayedColumns to sort with proper data ', () => {
        const sampleHearingPart = {
            id: '-1',
            sessionId: null,
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
            notes: []
        } as HearingPartViewModel;

        const displayedColumnsExpectedValues = [
            { columnName: 'caseNumber', expected: sampleHearingPart.caseNumber },
            { columnName: 'caseTitle', expected: sampleHearingPart.caseTitle },
            { columnName: 'caseType', expected: sampleHearingPart.caseType.description },
            { columnName: 'hearingType', expected: sampleHearingPart.hearingType.description },
            { columnName: 'duration', expected: sampleHearingPart.duration.asMilliseconds() },
            { columnName: 'communicationFacilitator', expected: sampleHearingPart.communicationFacilitator },
            { columnName: 'priority', expected: priorityValue(sampleHearingPart.priority) },
            { columnName: 'reservedJudge', expected: sampleHearingPart.reservedJudge.name },
            { columnName: 'notes', expected: 'No' },
            { columnName: 'scheduleStart', expected: sampleHearingPart.scheduleStart.unix() },
            { columnName: 'scheduleEnd', expected: sampleHearingPart.scheduleEnd.unix() },
            { columnName: 'selectHearing', expected: undefined },
            { columnName: 'delete', expected: undefined },
            { columnName: 'editor', expected: undefined },
        ];

        it(' tested columns should equal component displayedColumns field', () => {
            const columnsArray: string[] = displayedColumnsExpectedValues.map(r => r.columnName);
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

function generateHearingParts(id: string): HearingViewmodel {
    return {
        id: id,
        caseNumber: null,
        caseTitle: null,
        caseType: { code: '', description: '' } as CaseType,
        hearingType: { code: '', description: '' } as HearingType,
        duration: null,
        scheduleStart: null,
        scheduleEnd: null,
        version: null,
        priority: null,
        reservedJudgeId: null,
        reservedJudge: null,
        communicationFacilitator: null,
        notes: []
    }
};

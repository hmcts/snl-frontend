import { StoreModule } from '@ngrx/store';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import * as fromHearingParts from '../../reducers';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NoteComponent } from '../../../notes/components/note/note.component';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { DurationFormatPipe } from '../../../core/pipes/duration-format.pipe';
import * as judgesReducers from '../../../judges/reducers';
import * as transactionsReducers from '../../../features/transactions/reducers';
import { DurationAsMinutesPipe } from '../../../core/pipes/duration-as-minutes.pipe';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import * as moment from 'moment';
import { SessionAmendmentTableComponent } from './session-amendment-table.component';
import { SessionViewModel } from '../../models/session.viewmodel';
import { SessionType } from '../../../core/reference/models/session-type';

const now = moment();
let component: SessionAmendmentTableComponent;
let fixture: ComponentFixture<SessionAmendmentTableComponent>;

describe('SessionAmendmentTableComponent', () => {
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
                SessionAmendmentTableComponent,
                NoteComponent,
                NoteListComponent,
                DurationFormatPipe,
                DurationAsMinutesPipe,
                TransactionDialogComponent
            ],
            providers: [
                NoteListComponent,
                NotesPreparerService
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [TransactionDialogComponent]
            }
        });

        fixture = TestBed.createComponent(SessionAmendmentTableComponent);
        component = fixture.componentInstance;
    });

    describe('Implementation check of sortingDataAccessor on displayedColumns to sort with proper data ', () => {
        const sampleSessionViewModel = {
            id: '-1',
            start: now,
            duration: 1000,
            room: {name: 'room-name'},
            person: {name: 'judge-name'},
            sessionType: {code: 'st-code', description: 'st-description'} as SessionType,
            hearingParts: [],
            jurisdiction: '',
            version: 0,
            allocated: moment.duration('PT10M'),
            utilization: 0,
            available: moment.duration('PT10H'),
        } as SessionViewModel;

        const displayedColumnsExpectedValues = [
            {columnName: 'id', expected: sampleSessionViewModel.id},
            {columnName: 'person', expected: sampleSessionViewModel.person.name},
            {columnName: 'time', expected: sampleSessionViewModel.start.unix()},
            {columnName: 'date', expected: sampleSessionViewModel.start.unix()},
            {columnName: 'duration', expected: moment.duration('PT1S').asMilliseconds()},
            {columnName: 'room', expected: sampleSessionViewModel.room.name},
            {columnName: 'sessionType', expected: sampleSessionViewModel.sessionType.description},
            {columnName: 'hearingParts', expected: 0},
            {columnName: 'allocated', expected: sampleSessionViewModel.allocated.asMilliseconds()},
            {columnName: 'utilization', expected: 0},
            {columnName: 'available', expected: sampleSessionViewModel.available.asMilliseconds()},
        ];

        beforeEach(() => {
            component.sessions = [sampleSessionViewModel];
        });

        it(' tested columns should equal component displayedColumns field', () => {
            const columnsArray: string[] = displayedColumnsExpectedValues.map(r => r.columnName);
            expect(component.displayedColumns).toEqual(columnsArray);
        });

        for (let testCase of displayedColumnsExpectedValues) {
            it(`${testCase.columnName} should return proper value`, () => {
                const expected = testCase.expected;

                component.ngOnChanges();
                const result = component.dataSource.sortingDataAccessor(sampleSessionViewModel, testCase.columnName);

                expect(result).toBe(expected);
            });
        }

        it (' should return null when sessionType is with N/A description', () => {
            const testSamle = {
                ...sampleSessionViewModel,
                sessionType: {code: 'N/A', description: 'N/A'} as SessionType,
            };

            const expected = null;

            component.ngOnChanges();
            const result = component.dataSource.sortingDataAccessor(testSamle, 'sessionType');

            expect(result).toBe(expected);
        })
    });
});

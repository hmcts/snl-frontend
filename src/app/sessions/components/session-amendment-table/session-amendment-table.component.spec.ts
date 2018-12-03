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
import { SessionSearchResponse } from '../../models/session-search-response.model';

const now = moment();
let component: SessionAmendmentTableComponent;
let fixture: ComponentFixture<SessionAmendmentTableComponent>;

const mockSort = { active: false, direction: ''} as any;
const mockPaginator = { pageIndex: 0, pageSize: 10} as any;
const date = now.toISOString();
const expectedTime = now.format('HH:mm');
const expectedParsedDate = now.format();
const duration = 'PT30M'
const expectedDuration = '00:30'

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

    describe('Set Sessions', () => {
        const sessionSearchResponses: SessionSearchResponse[] = [{
            sessionId: 'session-id',
            personName: 'Grzes',
            roomName: 'Tryton',
            sessionTypeDescription: 'Office',
            startDate: now.format(),
            startTime: now.format(),
            duration: 'PT1S',
            noOfHearingPartsAssignedToSession: 0,
            allocatedDuration: 'PT1S',
            utilisation: 0,
            available: 'PT1S'
        }]

        it('should set sessions', () => {
            component.sessions = sessionSearchResponses;
            expect(component.sessions).toBe(sessionSearchResponses);
        })

        it('should set mat data source', () => {
            component.sessions = sessionSearchResponses;
            expect(component.dataSource.data).toBe(sessionSearchResponses);
        })
    });

    describe('emitTableSettings', () => {
        it('should emit table settings', (done) => {
            component.sort = mockSort;
            component.paginator = mockPaginator;

            component.tableSettings$.subscribe(data => {
                expect(data).toBeDefined()
                done()
            })

            component.emitTableSettings()
        })
    });

    describe('parseTime', () => {
        it('should parse date to hours and minutes', () => {
            expect(component.parseTime(date)).toEqual(expectedTime)
        })
    });

    describe('parseDate', () => {
        it('should parse date to hours and minutes', () => {
            expect(component.parseDate(date)).toEqual(expectedParsedDate)
        })
    });

    describe('humanizeDuration', () => {
        it('should parse date to hours and minutes', () => {
            expect(component.humanizeDuration(duration)).toEqual(expectedDuration)
        })
    });
});

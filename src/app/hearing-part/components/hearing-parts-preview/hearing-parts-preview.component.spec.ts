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
import { HearingPartModificationService } from '../../services/hearing-part-modification-service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { HearingPartsPreviewComponent } from './hearing-parts-preview.component';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
const openDialogMockObj = {
    afterClosed: (): Observable<boolean> => new Observable(() => {})
};
// let storeSpy: jasmine.Spy;
let component: HearingPartsPreviewComponent;
// let store: Store<fromHearingParts.State>;
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
        HearingPartModificationService,
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
    // storeSpy = spyOn(store, 'dispatch').and.callThrough();
    component.hearingParts = [generateHearingParts('123')];
  });

  describe('Initial state ', () => {
    it('should include priority', () => {
      expect(component.hearingParts[0]).toEqual(generateHearingParts('123'));
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch Get Judges ac ', () => {
        component.ngOnInit()

        expect(component.dataSource).toBeDefined();
    });

    it('should dispatch Get Judg ction', () => {
        let hasNotes = component.hasNotes(generateHearingParts('asd'));

        expect(hasNotes).toBeFalsy();
    });

    it('should dispatch Get Judges action', () => {
        matDialogSpy.open.and.returnValue(openDialogMockObj);

        component.openDeleteDialog({...generateHearingParts('asd'), caseNumber: '123'});

        expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('should dispatch Get Jusdsddges action', () => {
        matDialogSpy.open.and.returnValue(openDialogMockObj);

        component.openEditDialog({...generateHearingParts('asd'), caseNumber: '123'});

        expect(matDialogSpy.open).toHaveBeenCalled();
    });
  });
});

function generateHearingParts(id: string): HearingPartViewModel {
    return {
        id: id,
        session: null,
        caseNumber: null,
        caseTitle: null,
        caseType: null,
        hearingType: null,
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

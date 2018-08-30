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
const openDialogMockObjConfirmed = {
    afterClosed: (): Observable<boolean> => Observable.of(true)
};

const openDialogMockObjDeclined = {
    afterClosed: (): Observable<boolean> => Observable.of(false)
};
let hpms: HearingPartModificationService;
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
    hpms = TestBed.get(HearingPartModificationService);
    spyOn(hpms, 'deleteHearingPart');
    // storeSpy = spyOn(store, 'dispatch').and.callThrough();
    component.hearingParts = [generateHearingParts('123')];
  });

  describe('Initial state ', () => {
    it('should include priority', () => {
      expect(component.hearingParts[0]).toEqual(generateHearingParts('123'));
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
        expect(hpms.deleteHearingPart).toHaveBeenCalled();
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
        expect(hpms.deleteHearingPart).not.toHaveBeenCalled();
    });

    it('declining on edit dialog should not call service method', () => {
        matDialogSpy.open.and.returnValue(openDialogMockObjDeclined);

        component.openEditDialog({...generateHearingParts('asd'), caseNumber: '123'});

        expect(matDialogSpy.open).toHaveBeenCalled();
        expect(hpms.deleteHearingPart).not.toHaveBeenCalled();
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

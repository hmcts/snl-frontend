import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate } from '../../models/listing-create';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { getHearingPartsError } from '../../reducers';
import { GetById } from '../../actions/hearing-part.action';
import { Priority } from '../../models/priority-model';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import * as JudgeActions from '../../../judges/actions/judge.action';
import { Judge } from '../../../judges/models/judge.model';
import * as fromJudges from '../../../judges/reducers';
import { HearingPartModificationService } from '../../services/hearing-part-modification-service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog, MatSelectChange } from '@angular/material';
import * as fromNotes from '../../../notes/actions/notes.action';
import * as fromReferenceData from '../../../core/reference/reducers';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/combineLatest';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import { safe } from '../../../utils/js-extensions';
import { getNoteViewModel, NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { Note } from '../../../notes/models/note.model';

@Component({
    selector: 'app-listing-create',
    templateUrl: './listing-create.component.html',
    styleUrls: ['./listing-create.component.scss']
})
export class ListingCreateComponent implements OnInit {
    @ViewChild('notesList') noteList: NoteListComponent;
    @ViewChild('freeTextNotesList') freeTextNoteList: NoteListComponent;

    @Input() set data(value: ListingCreate) {
        this.listing = value;
        this.listing.notes = this.setNotesIfExist(value);
        this.setFormGroup();
    }

    @Input() editMode = false;

    @Output() onSave = new EventEmitter();

    listingCreate: FormGroup;
    communicationFacilitators = ['Sign Language', 'Interpreter', 'Digital Assistance', 'Custom'];
    errors = '';
    priorityValues = Object.values(Priority);
    judges: Judge[] = [];
    hearings: HearingType[] = [];
    noteViewModels: NoteViewmodel[] = [];
    freeTextNoteViewModels: NoteViewmodel[] = [];

    private _caseTypes: CaseType[] = [];
    get caseTypes(): CaseType[] { return this._caseTypes }
    set caseTypes(caseTypes: CaseType[]) {
        this._caseTypes = caseTypes
        const caseTypeCode = safe(() => this.listing.hearingPart.caseTypeCode)

        if (caseTypeCode) {
            this.hearings = this.getHearingTypesFromCaseType(caseTypeCode);
        }
    }

    caseTitleMaxLength = 200;
    caseNumberMaxLength = 200;

    public listing: ListingCreate;

    constructor(private readonly store: Store<State>,
                public dialog: MatDialog,
                private readonly notePreparerService: NotesPreparerService,
                private readonly hearingPartModificationService: HearingPartModificationService,
                readonly listingNotesConfig: ListingCreateNotesConfiguration) {

        this.store.select(getHearingPartsError).subscribe((error: any) => {
            this.errors = safe(error.message) || '';
        });
        this.store.select(fromJudges.getJudges).withLatestFrom(
            this.store.select(fromReferenceData.selectCaseTypes)
            , (judges, caseTypes: CaseType[]) => {
                this.judges = Object.values(judges);
                this.caseTypes = caseTypes;
            }
        ).subscribe(() => {
            if (!this.editMode) {
                this.initiateListing();
            }
            this.setFormGroup();
        });
    }

    ngOnInit() {
        this.store.dispatch(new JudgeActions.Get());
        this.initiateNotes();
    }

    save() {
        if (this.editMode) {
            this.edit();
        } else {
            this.create();
        }
        this.errors = ''
    }

    edit() {
        this.hearingPartModificationService.updateListingRequest(this.listing);
        this.openDialog('Editing listing request');

        this.onSave.emit();
    }

    create() {
        this.listing.hearingPart.id = uuid();

        this.hearingPartModificationService.createListingRequest(this.listing);
        this.openDialog('Creating listing request');
    }

    createNotes() {
        this.store.dispatch(new fromNotes.CreateMany(this.prepareNotes()));
    }

    prepareNotes() {
        let preparedNotes = this.notePreparerService.prepare(
            this.noteList.getModifiedNotes(),
            this.listing.hearingPart.id,
            this.listingNotesConfig.entityName
        );

        let preparedFreeTextNotes = this.notePreparerService.prepare(
            this.freeTextNoteList.getModifiedNotes(),
            this.listing.hearingPart.id,
            this.listingNotesConfig.entityName
        );

        return [...preparedNotes, ...preparedFreeTextNotes];
    }

    updateDuration(durationValue) {
        if (durationValue !== undefined && durationValue !== null) {
            this.listing.hearingPart.duration = moment.duration(durationValue, 'minute');
        }
    }

    validateTargetDates(control: AbstractControl): { [key: string]: boolean } {
        const targetFrom = control.get('targetFrom').value as moment.Moment;
        const targetTo = control.get('targetTo').value as moment.Moment;

        function isLogicallyUndefined(property: any) {
            return (property === undefined) || (property === '') || (property === null) || property.isValid() === false;
        }

        if (isLogicallyUndefined(targetFrom) || isLogicallyUndefined(targetTo)) {
            return null;
        }

        return targetFrom.isSameOrBefore(targetTo) ? null : {targetFromAfterTargetTo: true};
    }

    onCaseTypeChanged(event: MatSelectChange) {
        this.listing.hearingPart.hearingTypeCode = undefined;
        let newHearings = [];

        if (!(event.value === undefined || event.value === null)) {
            const selectedCode = event.value as string;
            newHearings = this.getHearingTypesFromCaseType(selectedCode);
        }
        this.hearings = newHearings;
    }

    private setNotesIfExist(hp: ListingCreate) {
        let defaultNotes = this.listingNotesConfig.defaultNotes().map(defaultNote => {
            const alreadyExistingNote = hp.notes.find(note => note.type === defaultNote.type);
            if (alreadyExistingNote !== undefined) {
                hp.notes = hp.notes.filter(n => n.id !== alreadyExistingNote.id);
            }
            return alreadyExistingNote || defaultNote
        });

        let notes = [...defaultNotes, ...hp.notes];
        if (this.containsOldFreeTextNote(notes)) {
            return [this.listingNotesConfig.getNewFreeTextNote(), ...notes];
        } else {
            return notes;
        }
    }

    private containsOldFreeTextNote(notes: Note[]) {
        return notes.find(n => n.type === 'Other note' && n.id === undefined) === undefined;
    }

    private initiateListing() {
        this.listing = this.defaultListing();
    }

    private getHearingTypesFromCaseType(selectedCaseTypeCode): HearingType[] {
        return this.caseTypes.find(ct => ct.code === selectedCaseTypeCode).hearingTypes;
    }

    private defaultListing(): ListingCreate {
        return {
            hearingPart: {
                id: undefined,
                caseNumber: undefined,
                caseTitle: undefined,
                caseTypeCode: undefined,
                hearingTypeCode: undefined,
                duration: undefined,
                scheduleStart: undefined,
                scheduleEnd: undefined,
                priority: Priority.Low,
                version: 0,
                reservedJudgeId: undefined,
                communicationFacilitator: undefined,
                userTransactionId: undefined,
            },
            notes: this.listingNotesConfig.defaultNotes(),
        };
    }

    private setFormGroup() {
        this.listingCreate = new FormGroup({
            caseNumber: new FormControl(
                this.listing.hearingPart.caseNumber,
                [Validators.required, Validators.maxLength(this.caseNumberMaxLength)]
            ),
            caseTitle: new FormControl(
                this.listing.hearingPart.caseTitle,
                [Validators.required, Validators.maxLength(this.caseTitleMaxLength)]
            ),
            caseTypeCode: new FormControl(
                this.listing.hearingPart.caseTypeCode,
                [Validators.required]
            ),
            hearingTypeCode: new FormControl(
                this.listing.hearingPart.hearingTypeCode,
                [Validators.required]
            ),
            duration: new FormControl(
                this.listing.hearingPart.duration ? this.listing.hearingPart.duration.asMinutes() : undefined,
                [Validators.required, Validators.min(1)]
            ),
            targetDates: new FormGroup({
                targetFrom: new FormControl(this.listing.hearingPart.scheduleStart),
                targetTo: new FormControl(this.listing.hearingPart.scheduleEnd),
            }, this.validateTargetDates)
        });
    }

    private openDialog(actionTitle: string) {
        this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...TransactionDialogComponent.DEFAULT_DIALOG_CONFIG,
            data: { actionTitle }
        }).afterClosed().subscribe((confirmed) => {
            this.afterClosed(confirmed);
        });
    }

    private initiateNotes() {
        this.listing.notes.map(getNoteViewModel)
            .map(this.disableShowingCreationDetailsOnNewNotes)
            .map(this.makeExistingFreetextNotesReadonly)
            .forEach(this.disposeToProperArrays);
    }

    private disableShowingCreationDetailsOnNewNotes(note: NoteViewmodel): NoteViewmodel {
        if (note.id === undefined) {
            note.displayCreationDetails = false;
        }
        return note;
    }

    private makeExistingFreetextNotesReadonly(n: NoteViewmodel): NoteViewmodel {
        if (n.type === 'Other note' && n.id !== undefined) {
            n.readonly = true;
        }

        return n;
    }

    private disposeToProperArrays = (n: NoteViewmodel) => {
        if (n.type === 'Other note') {
            this.freeTextNoteViewModels.push(n);
        } else {
            this.noteViewModels.push(n);
        }
    }

    afterClosed(confirmed) {
        if (confirmed) {
            this.createNotes();
        }
        if (this.editMode) {
            this.afterEdit();
        }
    }

    afterEdit() {
        this.store.dispatch(new GetById(this.listing.hearingPart.id));
    }
}

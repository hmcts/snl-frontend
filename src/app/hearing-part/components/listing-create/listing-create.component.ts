import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../app.state';
import { ListingCreate } from '../../models/listing-create';
import * as moment from 'moment';
import { Priority } from '../../models/priority-model';
import { NoteListComponent } from '../../../notes/components/notes-list/note-list.component';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import * as JudgeActions from '../../../judges/actions/judge.action';
import { Observable } from 'rxjs';
import { Judge } from '../../../judges/models/judge.model';
import * as fromJudges from '../../../judges/reducers';
import { map } from 'rxjs/operators';
import { asArray } from '../../../utils/array-utils';
import { HearingPart } from '../../models/hearing-part';
import { getHearingPartsError } from '../../reducers';
import { v4 as uuid } from 'uuid';
import { HearingPartModificationService } from '../../services/hearing-part-modification-service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';
import * as fromNotes from '../../../notes/actions/notes.action';
import { GetById } from '../../actions/hearing-part.action';

const DURATION_UNIT = 'minute';

@Component({
    selector: 'app-listing-create',
    templateUrl: './listing-create.component.html',
    styleUrls: ['./listing-create.component.scss']
})
export class ListingCreateComponent implements OnInit {
    @ViewChild(NoteListComponent) noteList: NoteListComponent;

    @Input() set data(value: ListingCreate) {
        this.listing = value;
        this.listing.notes = this.setNotesIfExist(value);
        this.initiateForm();
    }

    @Input() editMode = false;

    @Output() onSave = new EventEmitter();

    listingCreate: FormGroup;

    hearings: string[] = ['Preliminary Hearing', 'Trial Hearing', 'Adjourned Hearing'];
    caseTypes: string[] = ['SCLAIMS', 'FTRACK', 'MTRACK'];
    communicationFacilitators = ['None', 'Sign Language', 'Interpreter', 'Digital Assistance', 'Custom']
    errors = '';
    success: boolean;
    priorityValues = Object.values(Priority);
    judges$: Observable<Judge[]>;

    public listing: ListingCreate;

    constructor(private readonly store: Store<State>,
                public dialog: MatDialog,
                private readonly notePreparerService: NotesPreparerService,
                private readonly hearingPartModificationService: HearingPartModificationService,
                readonly listingNotesConfig: ListingCreateNotesConfiguration) {

        this.store.select(getHearingPartsError).subscribe((error: any) => {
            this.errors = error.message;
        });

        this.initiateListing();
        this.initiateForm();

        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(asArray)) as Observable<Judge[]>;
    }

    ngOnInit() {
        this.store.dispatch(new JudgeActions.Get());
    }

    save() {
        if (this.editMode) {
            this.edit();
        } else {
            this.create();
        }
    }

    edit() {
        this.hearingPartModificationService.updateListingRequest(this.listing, this.prepareNotes());
        this.openDialog();

        this.onSave.emit();
    }

    create() {
        this.listing.hearingPart.id = uuid();

        this.hearingPartModificationService.createListingRequest(this.listing, this.prepareNotes());
        this.openDialog();
    }

    createNotes() {
        this.store.dispatch(new fromNotes.CreateMany(this.prepareNotes()));
    }

    prepareNotes() {
        return this.notePreparerService.prepare(
            this.noteList.getModifiedNotes(),
            this.listing.hearingPart.id,
            this.listingNotesConfig.entityName
        );
    }

    updateDuration(durationValue) {
        if (durationValue !== undefined && durationValue !== null) {
            this.listing.hearingPart.duration = moment.duration(durationValue, 'minute')
        }
    }

    validateTargetDates(control: AbstractControl): {[key: string]: boolean} {
        const targetFrom = control.get('targetFrom').value as moment.Moment;
        const targetTo = control.get('targetTo').value as moment.Moment;

        function isLogicallyUndefined(property: any) {
            return (property === undefined) || (property === '') || (property === null)
        }

        if (isLogicallyUndefined(targetFrom) || isLogicallyUndefined(targetTo)) {
            return null;
        }

        return targetFrom.isSameOrBefore(targetTo) ? null : { targetFromAfterTargetTo: true };
    }

    private setNotesIfExist(hp: ListingCreate) {
        return this.listingNotesConfig.defaultNotes().map(note => {
            const obj = hp.notes.find(note1 => note1.type === note.type);
            if (obj === undefined) {
                return note;
            } else {
                return obj;
            }
        });
    }

    private initiateListing() {
        this.listing = this.defaultListing();
        this.errors = '';
        this.success = false;
    }

    private defaultListing() {
        const now = moment();

        return {
        hearingPart : {
            id: undefined,
            session: undefined,
            caseNumber: `number-${now.toISOString()}`,
            caseTitle: `title-${now.toISOString()}`,
            caseType: this.caseTypes[0],
            hearingType: this.hearings[0],
            duration: moment.duration(30, DURATION_UNIT),
            scheduleStart: now,
            scheduleEnd: moment().add(30, 'day'),
            priority: Priority.Low,
            version: 0,
            reservedJudgeId: undefined,
            communicationFacilitator: undefined
        } as HearingPart,
            notes: this.listingNotesConfig.defaultNotes(),
            userTransactionId: undefined
        } as ListingCreate;
    }

    private initiateForm() {
        this.listingCreate = new FormGroup({
            caseNumber: new FormControl(this.listing.hearingPart.caseNumber, Validators.required),
            caseTitle: new FormControl(this.listing.hearingPart.caseTitle, [Validators.required]),
            caseType: new FormControl(this.listing.hearingPart.caseType, [Validators.required]),
            hearingType: new FormControl(this.listing.hearingPart.hearingType, [Validators.required]),
            duration: new FormControl(this.listing.hearingPart.duration.asMinutes(), [Validators.required, Validators.min(1)]),
            targetDates: new FormGroup({
                targetFrom: new FormControl(this.listing.hearingPart.scheduleStart),
                targetTo: new FormControl(this.listing.hearingPart.scheduleEnd),
            }, this.validateTargetDates)
        })
    }

    private openDialog() {
        this.dialog.open(TransactionDialogComponent, {
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true
        }).afterClosed().subscribe((confirmed) => {this.afterClosed(confirmed)});
    }

    afterClosed(confirmed) {
        if (confirmed) {
            this.createNotes()
        };
        if (this.editMode) { this.afterEdit() } else { this.afterCreate() };
    }

    afterEdit() {
        this.store.dispatch(new GetById(this.listing.hearingPart.id));
        this.initiateListing();
    }

    afterCreate() {
        this.initiateListing();
    }
}

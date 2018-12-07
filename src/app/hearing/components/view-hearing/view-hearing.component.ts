import { Component, OnInit, ViewChild } from '@angular/core';
import { HearingService } from '../../services/hearing.service';
import { Hearing, ScheduledListing } from '../../models/hearing';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSelect } from '@angular/material';
import { HearingActions } from '../../models/hearing-actions';
import { Location } from '@angular/common';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../../hearing-part/models/listing-create-notes-configuration.model';
import { NoteType } from '../../../notes/models/note-type';
import { NotesService } from '../../../notes/services/notes.service';
import { PossibleHearingActionsService } from '../../services/possible-hearing-actions.service';
import { IPossibleActionConfigs } from '../../models/ipossible-actions';
import { AmendScheduledListingComponent } from '../amend-scheduled-listing/amend-scheduled-listing.component';
import { filter, map, tap } from 'rxjs/operators';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { v4 as uuid } from 'uuid';

@Component({
    selector: 'app-view-hearing',
    templateUrl: './view-hearing.component.html',
    styleUrls: ['./view-hearing.component.scss'],
    providers: [PossibleHearingActionsService]
})
export class ViewHearingComponent implements OnInit {
    public readonly HEARING_PART_STARTTIME_FORMAT = 'DD/MM/YYYY HH:mm';

    hearingId: string;
    hearing: Hearing;
    hearingActions = HearingActions;
    @ViewChild(MatSelect) actionSelect: MatSelect;
    possibleActionsKeys: string[];
    possibleActions: IPossibleActionConfigs;
    note: NoteViewmodel;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly dialog: MatDialog,
        private readonly hearingService: HearingService,
        private readonly notesPreparerService: NotesPreparerService,
        private readonly listingCreateNotesConfiguration: ListingCreateNotesConfiguration,
        private readonly notesService: NotesService,
        private readonly location: Location,
        private readonly possibleActionsService: PossibleHearingActionsService
    ) {
    }

    ngOnInit() {
        this.hearingId = this.route.snapshot.paramMap.get('id');
        this.note = this.listingCreateNotesConfiguration.getOrCreateNote([], NoteType.LISTING_NOTE, 'Add listing note');
        this.hearingService.hearings.pipe(
            map(hearings => hearings.find(h => h.id === this.hearingId)),
            filter(hearing => (hearing !== undefined) && (hearing !== null)),
            tap(hearing => {
                this.hearing = hearing;
                this.possibleActions = this.possibleActionsService.mapToHearingPossibleActions(hearing);
                this.possibleActionsKeys = Object.keys(this.possibleActions)
            })
        ).subscribe();

        this.fetchHearing();
    }

    getListBetween() {
        const start = this.hearing.scheduleStart;
        const end = this.hearing.scheduleEnd;

        if (!start && !end) {
            return '';
        }

        if (start && !end) {
            return 'after ' + moment(start).format();
        }

        if (!start && end) {
            return 'before ' + moment(end).format();
        }

        if (start && end) {
            return moment(start).format()
                + ' - '
                + moment(end).format();
        }
    }

    isScheduledListingNotesPanelDisabled(scheduledListing: ScheduledListing) {
        return scheduledListing.notes === undefined || scheduledListing.notes.length === 0;
    }

    onActionChanged(event: { value: HearingActions }) {
        this.possibleActionsService.handleAction(event.value, this.hearing);
        this.actionSelect.writeValue(HearingActions.Actions)
    }

    onSubmit(note: NoteViewmodel) {
        const preparedNote = this.notesPreparerService.prepare([note], this.hearingId, this.listingCreateNotesConfiguration.entityName);
        this.notesService.upsertMany(preparedNote).subscribe(() => {
            this.fetchHearing();
            this.note = this.listingCreateNotesConfiguration.getOrCreateNote([], NoteType.LISTING_NOTE, 'Add listing note');
        });
    }

    goBack() {
        this.location.back();
    }

    openAmendDialog(scheduledListing: ScheduledListing) {
        let amendData: AmendScheduledListingData = {
            startTime: scheduledListing.hearingPartStartTime.format('HH:mm')
        };
        this.dialog.open(AmendScheduledListingComponent, {
            data: amendData
        }).afterClosed().pipe(
            filter(data => data !== undefined),
            map<AmendScheduledListingData, AmendScheduledListing>((data: AmendScheduledListingData) => {
                return {
                    hearingPartId: scheduledListing.hearingPartIdOfCurrentHearing,
                    hearingPartVersion: scheduledListing.hearingPartVersionOfCurrentHearing,
                    userTransactionId: uuid(),
                    startTime: data.startTime
                }
            }),
            tap((data: AmendScheduledListing) => {
                this.hearingService.amendScheduledListing(data);
                this.openDialog('Editing listing request');
            })
        ).subscribe()
    }

    private openDialog(actionTitle: string) {
        this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: {actionTitle}
        }).afterClosed().pipe(
            filter(confirmed => confirmed === true),
            tap(() => this.fetchHearing())
        ).subscribe();
    }

    private fetchHearing() {
        this.hearingService.getById(this.hearingId);
    }
}

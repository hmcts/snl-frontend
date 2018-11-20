import { DEFAULT_DIALOG_CONFIG } from './../../../features/transactions/models/default-dialog-confg';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HearingService } from '../../services/hearing.service';
import { Hearing, Session } from '../../models/hearing';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { DialogWithActionsComponent } from '../../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { MatDialog, MatSelect } from '@angular/material';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { HearingActions } from '../../models/hearing-actions';
import { Location } from '@angular/common';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../../hearing-part/models/listing-create-notes-configuration.model';
import { NoteType } from '../../../notes/models/note-type';
import { NotesService } from '../../../notes/services/notes.service';
import { formatDuration } from '../../../utils/date-utils';
import { Status } from '../../../core/reference/models/status.model';

@Component({
  selector: 'app-view-hearing',
  templateUrl: './view-hearing.component.html',
  styleUrls: ['./view-hearing.component.scss']
})
export class ViewHearingComponent implements OnInit {
  hearingId: string
  hearing: Hearing;
  hearingActions = HearingActions
  @ViewChild(MatSelect) actionSelect: MatSelect;

  note: NoteViewmodel;

  constructor(
    private route: ActivatedRoute,
    private readonly hearingService: HearingService,
    private readonly notesPreparerService: NotesPreparerService,
    private readonly listingCreateNotesConfiguration: ListingCreateNotesConfiguration,
    private readonly notesService: NotesService,
    private readonly dialog: MatDialog,
    private readonly location: Location
  ) {
  }

  ngOnInit() {
    this.hearingId = this.route.snapshot.paramMap.get('id');
    this.note = this.listingCreateNotesConfiguration.getOrCreateNote([], NoteType.LISTING_NOTE, 'Add listing note');
    this.hearingService.hearings
      .map(hearings => hearings.find(h => h.id === this.hearingId))
      .subscribe(hearing => this.hearing = hearing);

    this.fetchHearing();
  }

  private openSummaryDialog() {
      return this.dialog.open(TransactionDialogComponent, {
          ...DEFAULT_DIALOG_CONFIG,
          data: 'Unlist hearing parts from session'
      });
  }

  private fetchHearing() {
      this.hearingService.getById(this.hearingId);
  }

  formatDate(date: string): string {
    return moment(date).format();
  }

  formatDuration(duration: string): string {
    return formatDuration(moment.duration(duration))
  }

  getListBetween() {
    const start = this.hearing.scheduleStart;
    const end = this.hearing.scheduleEnd;

    if (!start && !end) {
      return '';
    }

    if (start && !end) {
      return 'after ' + this.formatDate(start);
    }

    if (!start && end) {
      return 'before ' + this.formatDate(end);
    }

    if (start && end) {
      return this.formatDate(start)
        + ' - '
        + this.formatDate(end);
    }
  }

  onActionChanged(event: {value: HearingActions}) {
    if (event.value === HearingActions.Unlist || HearingActions.Withdraw) {
        this.confirmationDialog(event.value);
    }

    this.actionSelect.writeValue(HearingActions.Actions)
  }

  isSessionPanelDisabled(session: Session) {
    return session.notes === undefined || session.notes.length === 0;
  }

  goBack() {
    this.location.back();
  }

  isListed() {
    return this.hearing.status === Status.Listed;
  }

  canWithdraw() {
      return this.isListed();
  }

  confirmationDialog(action: HearingActions) {
    switch (action) {
        case HearingActions.Unlist:
            const confirmationUnlistDialogRef = this.dialog.open(DialogWithActionsComponent, {
                ...DEFAULT_DIALOG_CONFIG,
                data: {
                    title: 'Unlist hearing',
                    message: 'Are you sure you want to unlist this hearing?' +
                        'Once you do this you will need to relist the hearing and all subsequent hearing parts.',
                },
                width: '350px'
            });

            confirmationUnlistDialogRef.afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.hearingService.unlist(this.hearing);
                    this.openSummaryDialog().afterClosed().subscribe((success) => {
                        if (success) {
                            this.fetchHearing();
                        }
                    });
                }
            });
            break;
        case HearingActions.Withdraw:
            const confirmationWithdrawDialogRef = this.dialog.open(DialogWithActionsComponent, {
                ...DEFAULT_DIALOG_CONFIG,
                data: {
                    title: 'Withdraw hearing',
                    message: 'Are you sure you want to withdraw this hearing? Once you do this you will be unable to revert your changes.'
                },
                width: '350px'
            });

            confirmationWithdrawDialogRef.afterClosed().subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.hearingService.withdraw(this.hearing);
                    this.openSummaryDialog().afterClosed().subscribe((success) => {
                        if (success) {
                            this.fetchHearing();
                        }
                    });
                }
            });
            break;
    }
  }

  onSubmit(note: NoteViewmodel) {
    const preparedNote = this.notesPreparerService.prepare([note], this.hearingId, this.listingCreateNotesConfiguration.entityName);
    this.notesService.upsertMany(preparedNote).subscribe(data => {
      this.fetchHearing();
      this.note = this.listingCreateNotesConfiguration.getOrCreateNote([], NoteType.LISTING_NOTE, 'Add listing note');
    });
  }
}

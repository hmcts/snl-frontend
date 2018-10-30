import { DEFAULT_DIALOG_CONFIG } from './../../../features/transactions/models/default-dialog-confg';
import { Component, OnInit } from '@angular/core';
import { HearingService } from '../../services/hearing.service';
import { Hearing, Session } from '../../models/hearing';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { DialogWithActionsComponent } from '../../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { MatDialog } from '@angular/material';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { HearingActions } from '../../models/hearin-actions';

@Component({
  selector: 'app-view-hearing',
  templateUrl: './view-hearing.component.html',
  styleUrls: ['./view-hearing.component.scss']
})
export class ViewHearingComponent implements OnInit {
  hearingId: string
  hearing: Hearing;
  hearingActions = HearingActions

  constructor(
    private route: ActivatedRoute,
    private readonly hearingService: HearingService,
    private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.hearingId = this.route.snapshot.paramMap.get('id');
    this.hearingService.hearings
      .map(hearings => hearings.find(h => h.id === this.hearingId))
      .subscribe(hearing => this.hearing = hearing);

    this.fetchHearing();
  }

  formatDate(date: string): string {
    return moment(date).format();
  }

  formatDuration(duration: string): string {
    const minutes = moment.duration(duration).asMinutes();

    return Math.ceil(minutes) + ' minutes';
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
    switch (event.value) {
      case HearingActions.Unlist:
        this.openConfirmationDialog();
      break;
      default: /* no-op */
    }
  }

  isSessionPanelDisabled(session: Session) {
    return session.notes === undefined || session.notes.length === 0;
  }

  isListed() {
    return this.hearing.sessions.length > 0
  }

  openConfirmationDialog() {
    const confirmationDialogRef = this.dialog.open(DialogWithActionsComponent, {
        ...DEFAULT_DIALOG_CONFIG,
        data: {
            title: 'Unlist hearing',
            message: 'Are you sure you want to unlist this hearing?' +
            'Once you do this you will need to relist the hearing and all subsequent hearing parts.',
        },
        width: '350px'
    });

    confirmationDialogRef.afterClosed().subscribe(this.confirmationDialogClosed);
  }

  public confirmationDialogClosed = (confirmed: boolean) => {
    if (confirmed) {
      this.hearingService.unlist(this.hearing)
      this.openSummaryDialog().afterClosed().subscribe((success) => {
          if (success) {
              this.fetchHearing();
          }
      });
    }
  };

  private openSummaryDialog() {
    return this.dialog.open(TransactionDialogComponent, {
        ...DEFAULT_DIALOG_CONFIG,
        data: 'Unlist hearing parts from session'
    });
  }

  private fetchHearing() {
    const id = this.route.snapshot.paramMap.get('id')
    this.hearingService.getById(id);
  }
}

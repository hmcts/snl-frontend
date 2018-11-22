import { Component, OnInit, ViewChild } from '@angular/core';
import { HearingService } from '../../services/hearing.service';
import { Hearing, Session } from '../../models/hearing';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatSelect } from '@angular/material';
import { HearingActions } from '../../models/hearing-actions';
import { Location } from '@angular/common';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';
import { ListingCreateNotesConfiguration } from '../../../hearing-part/models/listing-create-notes-configuration.model';
import { NoteType } from '../../../notes/models/note-type';
import { NotesService } from '../../../notes/services/notes.service';
import { formatDuration } from '../../../utils/date-utils';
import { Status } from '../../../core/reference/models/status.model';
import { PossibleActionsService } from '../../services/possible-actions-service';

@Component({
  selector: 'app-view-hearing',
  templateUrl: './view-hearing.component.html',
  styleUrls: ['./view-hearing.component.scss'],
  providers: [PossibleActionsService]
})
export class ViewHearingComponent implements OnInit {
  hearingId: string;
  hearing: Hearing;
  hearingActions = HearingActions;
  @ViewChild(MatSelect) actionSelect: MatSelect;
  objectKeys = Object.keys;

  possibleActions;

  note: NoteViewmodel;

  constructor(
    private route: ActivatedRoute,
    private readonly hearingService: HearingService,
    private readonly notesPreparerService: NotesPreparerService,
    private readonly listingCreateNotesConfiguration: ListingCreateNotesConfiguration,
    private readonly notesService: NotesService,
    private readonly location: Location,
    private readonly possibleActionsService: PossibleActionsService
  ) {
  }

  ngOnInit() {
    this.hearingId = this.route.snapshot.paramMap.get('id');
    this.note = this.listingCreateNotesConfiguration.getOrCreateNote([], NoteType.LISTING_NOTE, 'Add listing note');
    this.hearingService.hearings
      .map(hearings => hearings.find(h => h.id === this.hearingId))
      .subscribe(hearing => {
        this.hearing = hearing;
        if (hearing) {
            this.possibleActions = this.possibleActionsService.mapToHearingPossibleActions(hearing);
        }
      });

    this.fetchHearing();
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
    this.possibleActionsService.handleAction(event.value, this.hearing);
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

  onSubmit(note: NoteViewmodel) {
    const preparedNote = this.notesPreparerService.prepare([note], this.hearingId, this.listingCreateNotesConfiguration.entityName);
    this.notesService.upsertMany(preparedNote).subscribe(data => {
      this.fetchHearing();
      this.note = this.listingCreateNotesConfiguration.getOrCreateNote([], NoteType.LISTING_NOTE, 'Add listing note');
    });
  }
}

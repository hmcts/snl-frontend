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
import { PossibleHearingActionsService } from '../../services/possible-hearing-actions.service';
import { IPossibleActionConfigs } from '../../models/ipossible-actions';

@Component({
  selector: 'app-view-hearing',
  templateUrl: './view-hearing.component.html',
  styleUrls: ['./view-hearing.component.scss'],
  providers: [PossibleHearingActionsService]
})
export class ViewHearingComponent implements OnInit {
  hearingId: string;
  hearing: Hearing;
  hearingActions = HearingActions;
  @ViewChild(MatSelect) actionSelect: MatSelect;
  possibleActionsKeys: string[];
  possibleActions: IPossibleActionConfigs;
  note: NoteViewmodel;

  constructor(
    private readonly route: ActivatedRoute,
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
    this.hearingService.hearings
      .map(hearings => hearings.find(h => h.id === this.hearingId))
      .subscribe(hearing => {
        this.hearing = hearing;
        if (hearing) {
            this.possibleActions = this.possibleActionsService.mapToHearingPossibleActions(hearing);
            this.possibleActionsKeys = Object.keys(this.possibleActions)
        }
      });

    this.fetchHearing();
  }

  formatDate(date: string): string {
    return moment(date).format();
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

    isSessionPanelDisabled(session: Session) {
        return session.notes === undefined || session.notes.length === 0;
    }

    onActionChanged(event: {value: HearingActions}) {
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

    private fetchHearing() {
        this.hearingService.getById(this.hearingId);
    }
}

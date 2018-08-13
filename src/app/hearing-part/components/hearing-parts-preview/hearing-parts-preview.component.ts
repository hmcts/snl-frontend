import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment'
import { SelectionModel } from '@angular/cdk/collections';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';
import { NotesListDialogComponent } from '../../../notes/components/notes-list-dialog/notes-list-dialog.component';
@Component({
  selector: 'app-hearing-parts-preview',
  templateUrl: './hearing-parts-preview.component.html',
  styleUrls: ['./hearing-parts-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingPartsPreviewComponent implements OnInit, OnChanges {
    @Input() hearingParts: HearingPartViewModel[];
    @Input() sessions: SessionViewModel[];
    @Output() selectHearingPart = new EventEmitter();

    selectedHearingPart;

    hearingPartsDataSource: MatTableDataSource<HearingPartViewModel>;
    displayedColumns = [
      'case number',
      'case title',
      'case type',
      'hearing type',
      'duration',
      'target schedule from',
      'target schedule to',
      'listed',
      'select hearing',
      'notes',
      'communication facilitator',
      'priority',
      'reserved judge'
    ];

    constructor(public dialog: MatDialog) {
        this.selectedHearingPart = new SelectionModel<HearingPartViewModel>(false, []);
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.hearingPartsDataSource = new MatTableDataSource(Object.values(this.hearingParts));
    }

    humanizeDuration(duration) {
        return moment.duration(duration).humanize();
    }

    parseDate(date) {
        return moment(date).format('DD/MM/YYYY');
    }

    isListed(sessionId) {
        return sessionId !== undefined && sessionId !== '' && sessionId !== null ? 'Yes' : 'No';
    }

    hasNotes(hearingPart: HearingPartViewModel): boolean {
        return hearingPart.notes.length > 0;
    }

    openNotesDialog(hearingPart: HearingPartViewModel) {
        if (this.hasNotes(hearingPart)) {
            this.dialog.open(NotesListDialogComponent, {
                data: hearingPart.notes,
                hasBackdrop: false,
                width: '30%'
            })
        } else {
            return;
        }
    }

    toggleHearing(hearing) {
        this.selectedHearingPart.toggle(hearing)
        this.selectHearingPart.emit(this.selectedHearingPart.isSelected(hearing) ? hearing : {})
    }
}

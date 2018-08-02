import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { HearingPart } from '../../models/hearing-part';
import { MatTableDataSource } from '@angular/material';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment'
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-hearing-parts-preview',
  templateUrl: './hearing-parts-preview.component.html',
  styleUrls: ['./hearing-parts-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingPartsPreviewComponent implements OnInit, OnChanges {
    @Input() hearingParts: HearingPart[];
    @Input() sessions: SessionViewModel[];
    @Output() selectHearingPart = new EventEmitter();

    selectedHearingPart;

    hearingPartsDataSource: MatTableDataSource<HearingPart>;
    displayedColumns = [
      'case number',
      'case title',
      'case type',
      'hearing type',
      'duration',
      'target schedule from',
      'target schedule to',
      'listed',
      'select hearing'
    ];

    constructor() {
        this.selectedHearingPart = new SelectionModel<HearingPart>(false, []);
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

    toggleHearing(hearing) {
        this.selectedHearingPart.toggle(hearing)
        this.selectHearingPart.emit(this.selectedHearingPart.isSelected(hearing) ? hearing : {})
    }
}

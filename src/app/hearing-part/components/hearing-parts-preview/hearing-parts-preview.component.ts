import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { HearingPart } from '../../models/hearing-part';
import { MatTableDataSource } from '@angular/material';
import { Session } from '../../../sessions/models/session.model';
import { SessionAssignment } from '../../models/session-assignment';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment'
@Component({
  selector: 'app-hearing-parts-preview',
  templateUrl: './hearing-parts-preview.component.html',
  styleUrls: ['./hearing-parts-preview.component.scss']
})
export class HearingPartsPreviewComponent implements OnInit, OnChanges {
    @Input() hearingParts: HearingPart[];
    @Input() sessions: SessionViewModel[];
    @Output() assignToSession = new EventEmitter<SessionAssignment>();

    hearingPartsDataSource: MatTableDataSource<HearingPart>;
    displayedColumns = [
      'case number',
      'case title',
      'case type',
      'hearing type',
      'duration',
      'target schedule from',
      'target schedule to',
      'session',
      'action',
      'listed'
    ];

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.hearingPartsDataSource = new MatTableDataSource(Object.values(this.hearingParts));
    }

    parseDate(date) {
        return moment(date).format('MMM Do YY');
    }

    humanizeDuration(duration) {
        return moment.duration(duration).humanize();
    }

    isListed(sessionId) {
        return sessionId !== undefined && sessionId !== null && sessionId !== '' ? 'Yes' : 'No';
    }
}

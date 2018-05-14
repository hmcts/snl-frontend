import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { HearingPart } from '../../models/hearing-part';
import { MatTableDataSource } from '@angular/material';
import { SessionAssignment } from '../../models/session-assignment';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment'
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-hearing-parts-preview',
  templateUrl: './hearing-parts-preview.component.html',
  styleUrls: ['./hearing-parts-preview.component.scss']
})
export class HearingPartsPreviewComponent implements OnInit, OnChanges {
    @Input() hearingParts: HearingPart[];
    @Input() sessions: SessionViewModel[];
    @Output() selectHearingPart = new EventEmitter();

    selectedHearingPartId;

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
    }

    ngOnInit() {
        this.selectedHearingPartId = new SelectionModel<string>(false, []);
    }

    ngOnChanges() {
        this.hearingPartsDataSource = new MatTableDataSource(Object.values(this.hearingParts));
    }

    humanizeDuration(duration) {
        return moment.duration(duration).humanize();
    }

    isListed(sessionId) {
        console.log(sessionId);
        return sessionId !== undefined && sessionId !== '' && sessionId !== null ? 'Yes' : 'No';
    }

    toggleHearing(id) {
        this.selectedHearingPartId.toggle(id)
        this.selectHearingPart.emit(this.selectedHearingPartId.isSelected(id) ? id : '')
    }
}

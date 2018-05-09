import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HearingPart } from '../../models/hearing-part';
import { MatTableDataSource } from '@angular/material';
import { Session } from '../../../sessions/models/session.model';
import { SessionAssignment } from '../../models/session-assignment';

@Component({
  selector: 'app-hearing-parts-preview',
  templateUrl: './hearing-parts-preview.component.html',
  styleUrls: ['./hearing-parts-preview.component.scss']
})
export class HearingPartsPreviewComponent implements OnInit {
    @Input() hearingParts: HearingPart[];
    @Input() sessions: Session[];
    @Output() assignToSession = new EventEmitter<SessionAssignment>();

    chosenSessionId: number;

    hearingPartsDataSource: MatTableDataSource<HearingPart>;
    displayedColumns = [
      'case number',
      'case title',
      'case type',
      'hearing type',
      'duration',
      'target schedule from',
      'target schedule to',
      'sessions'
    ];

    constructor() {
    }

    ngOnInit() {
      this.hearingPartsDataSource = new MatTableDataSource(this.hearingParts);
    }

}

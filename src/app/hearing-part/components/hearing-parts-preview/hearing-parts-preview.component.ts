import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HearingPart } from '../../models/hearing-part';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-hearing-parts-preview',
  templateUrl: './hearing-parts-preview.component.html',
  styleUrls: ['./hearing-parts-preview.component.scss']
})
export class HearingPartsPreviewComponent implements OnInit {
  @Input() hearingParts: HearingPart[];
  @Output() assignToSession = new EventEmitter<number>();

    hearingPartsDataSource: MatTableDataSource<HearingPart>;
  displayedColumns = ['case number',
      'case title',
      'case type',
      'hearing type',
      'duration',
      'target schedule from',
      'target schedule to',
      'actions'];

  constructor() {
  }

  ngOnInit() {
      this.hearingPartsDataSource = new MatTableDataSource(this.hearingParts);
  }

}

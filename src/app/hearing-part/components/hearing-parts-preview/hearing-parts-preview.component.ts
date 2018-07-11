import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { HearingPart } from '../../models/hearing-part';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import * as moment from 'moment'
import { SelectionModel } from '@angular/cdk/collections';

interface HearingPartTableData extends HearingPart {
    humanizedDuration: string,
    humanizedScheduleStart: string,
    humanizedScheduleEnd: string
}

@Component({
  selector: 'app-hearing-parts-preview',
  templateUrl: './hearing-parts-preview.component.html',
  styleUrls: ['./hearing-parts-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingPartsPreviewComponent implements OnInit, OnChanges {
    @Input() hearingParts: HearingPart[];
    @Output() selectHearingPart = new EventEmitter();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    tableData: HearingPart[];

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
        this.tableData = this.hearingParts.map((element: HearingPart) => {
            let tableRow: HearingPartTableData;
            let scheduleStart = new Date(element.scheduleStart);
            let scheduleEnd = new Date(element.scheduleEnd);

            tableRow = {...element,
                humanizedScheduleStart: this.parseDate(scheduleStart),
                humanizedScheduleEnd: this.parseDate(scheduleEnd),
                humanizedDuration: moment.duration(element.duration).humanize(),
            };
            return tableRow;
        });

        this.hearingPartsDataSource = new MatTableDataSource(Object.values(this.tableData));
        this.hearingPartsDataSource.paginator = this.paginator;
    }

    parseDate(date) {
        return moment(date).format('DD/MM/YYYY');
    }

    isListed(sessionId) {
        return sessionId !== undefined && sessionId !== '' && sessionId !== null ? 'Yes' : 'No';
    }

    toggleHearing(id) {
        this.selectedHearingPartId.toggle(id)
        this.selectHearingPart.emit(this.selectedHearingPartId.isSelected(id) ? id : '')
    }
}

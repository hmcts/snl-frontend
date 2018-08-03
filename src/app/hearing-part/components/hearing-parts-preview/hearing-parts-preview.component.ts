import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { HearingPart } from '../../models/hearing-part';
import { MatSort, MatTableDataSource } from '@angular/material';
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
    @ViewChild(MatSort) sort: MatSort;

    selectedHearingPart;

    dataSource: MatTableDataSource<HearingPart>;
    displayedColumns = [
      'caseNumber',
      'caseTitle',
      'caseType',
      'hearingType',
      'duration',
      'scheduleStart',
      'scheduleEnd',
      'listed',
      'selectHearing'
    ];



    constructor() {
        this.selectedHearingPart = new SelectionModel<HearingPart>(false, []);
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearingParts));

    }

    ngOnChanges() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearingParts));
        console.log(Object.values(this.hearingParts));

        //funny it sorts wrong if don't do this :o
        this.dataSource.sortingDataAccessor = (item, property) => {
            return item[property];
        }

        this.dataSource.sort = this.sort;
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
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

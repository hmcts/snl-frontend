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
      'selectHearing',
      'caseNumber',
      'caseTitle',
      'caseType',
      'hearingType',
      'duration',
      'scheduleStart',
      'scheduleEnd',
    ];

    constructor() {
        this.selectedHearingPart = new SelectionModel<HearingPart>(false, []);
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearingParts));
    }

    ngOnChanges() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearingParts));

        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'duration':
                    return moment.duration(item[property]).asMilliseconds();
                default:
                    return item[property];
            }
            return item[property];
        }

        this.dataSource.sort = this.sort;
    }

    humanizeDuration(duration) {
        return moment.utc(moment.duration(duration).asMilliseconds()).format('HH:mm');
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

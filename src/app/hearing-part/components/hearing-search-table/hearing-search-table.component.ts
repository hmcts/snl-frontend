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
import { MatDialog, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import * as moment from 'moment';
import { FilteredHearingViewmodel } from '../../models/filtered-hearing-viewmodel';
import { Status } from '../../../core/reference/models/status.model';

@Component({
    selector: 'app-hearing-search-table',
    templateUrl: './hearing-search-table.component.html',
    styleUrls: ['./hearing-search-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingSearchTableComponent implements OnInit, OnChanges {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() hearings: FilteredHearingViewmodel[];
    @Input() totalCount: number;
    @Output() onDelete = new EventEmitter<FilteredHearingViewmodel>();
    @Output() onAmend = new EventEmitter<string>();
    @Output() onNextPage = new EventEmitter<PageEvent>()

    dataSource: MatTableDataSource<FilteredHearingViewmodel>;
    displayedColumns = [
        'caseNumber',
        'caseTitle',
        'priority',
        'caseType',
        'hearingType',
        'communicationFacilitator',
        'reservedJudge',
        'requestStatus',
        'listingDate',
        'delete',
        'amend'
    ];

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearings));
        this.paginator.page.subscribe(pageEvent => this.onNextPage.emit(pageEvent))
    }

    ngOnChanges() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearings));
    }

    parseDate(date) {
        return date ? moment(date).format('DD/MM/YYYY') : null;
    }

    delete(hearing: FilteredHearingViewmodel) {
        this.onDelete.emit(hearing);
    }

    amend(hearingId: string) {
        this.onAmend.emit(hearingId);
    }

    buildViewHearingUrl(id: string) {
        return `/home/hearing/${id}`;
    }

    canEdit(hearing: FilteredHearingViewmodel) {
        return hearing.status === Status.Unlisted || (hearing.status === Status.Listed
            && moment(moment(hearing.listingDate).format('YYYY-MM-DD')).isAfter(moment(moment().format('YYYY-MM-DD'))));
    }
}

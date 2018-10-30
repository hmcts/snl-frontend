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

    getStatusText(element: FilteredHearingViewmodel) {
        return element.isListed ? 'listed' : 'unlisted';
    }

    amend(hearing: FilteredHearingViewmodel) {
        this.onAmend.emit(hearing.id);
    }
}

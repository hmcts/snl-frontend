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
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import * as moment from 'moment';
import { priorityValue } from '../../models/priority-model';
import { getPropertyMemberOrNull } from '../../../utils/js-extensions';
import { FilteredHearingViewmodel } from '../../models/filtered-hearing-viewmodel';

@Component({
    selector: 'app-hearing-search-table',
    templateUrl: './hearing-search-table.component.html',
    styleUrls: ['./hearing-search-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingSearchTableComponent implements OnInit, OnChanges {
    @ViewChild(MatSort) sort: MatSort;
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

        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'reservedJudge':
                    return getPropertyMemberOrNull(item, property, 'name');

                case 'caseType':
                case 'hearingType':
                    return getPropertyMemberOrNull(item, property, 'description');

                case 'priority':
                    return priorityValue(item[property]);

                case 'listingDate':
                case 'scheduleStart':
                    return (item['scheduleStart']) ? item['scheduleStart'].unix() : null;
                case 'requestStatus':
                    return item['isListed'] ? 'listed' : 'unlisted';

                default:
                    return item[property];
            }
        };

        this.dataSource.sort = this.sort;
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

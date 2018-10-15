import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { priorityValue } from '../../models/priority-model';
import { HearingViewmodel } from '../../models/hearing.viewmodel';

@Component({
    selector: 'app-hearing-search-table',
    templateUrl: './hearing-search-table.component.html',
    styleUrls: ['./hearing-search-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingSearchTableComponent implements OnInit, OnChanges {
    @Input() hearings: HearingViewmodel[];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    dataSource: MatTableDataSource<HearingViewmodel>;
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
    ];

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearings));
    }

    ngOnChanges() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearings));

        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'reservedJudge':
                    return this.getPropertyMemberOrNull(item, property, 'name');

                case 'caseType':
                case 'hearingType':
                    return this.getPropertyMemberOrNull(item, property, 'description');

                case 'priority':
                    return priorityValue(item[property]);

                case 'listingDate':
                case 'scheduleStart':
                    return (item['scheduleStart']) ? item['scheduleStart'].unix() : null;

                default:
                    return item[property];
            }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    parseDate(date) {
        if (date) {
            return moment(date).format('DD/MM/YYYY');
        } else {
            return null;
        }
    }

    getStatusText(element: HearingViewmodel) {
        if (element.isListed) {
            return 'listed';
        } else {
            return 'unlisted';
        }
    }

    private getPropertyMemberOrNull(item: object, property: string, key: string) {
        return (item[property]) ? item[property][key] : null;
    }
}

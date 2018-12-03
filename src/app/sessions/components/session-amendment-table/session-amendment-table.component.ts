import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { formatDuration } from '../../../utils/date-utils';
import { SessionSearchResponse } from '../../models/session-search-response.model';
import { TableSetting } from '../../models/table-settings.model';
import { SessionSearchColumn } from '../../models/session-search-column';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableSettings } from '../../../hearing-part/models/table-settings.model';

@Component({
    selector: 'app-session-amendment-table',
    templateUrl: './session-amendment-table.component.html',
    styleUrls: ['./session-amendment-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionAmendmentTableComponent {
    public static DEFAULT_TABLE_SETTINGS: TableSettings = {
        pageSize: 20,
        pageIndex: 0,
        sortByProperty: SessionSearchColumn.StartDate,
        sortDirection: 'asc'
    };

    @Output() amend = new EventEmitter();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() totalCount: number;

    displayedColumns = [
        SessionSearchColumn.SessionId,
        SessionSearchColumn.PersonName,
        SessionSearchColumn.StartTime,
        SessionSearchColumn.StartDate,
        SessionSearchColumn.Duration,
        SessionSearchColumn.RoomName,
        SessionSearchColumn.SessionTypeDescription,
        SessionSearchColumn.NoOfHearingPartsAssignedToSession,
        SessionSearchColumn.AllocatedDuration,
        SessionSearchColumn.Utilisation,
        SessionSearchColumn.Available,
        SessionSearchColumn.Amend,
    ];

    dataSource: MatTableDataSource<any>;
    tableVisible = true;
    sessionSearchColumns = SessionSearchColumn

    private _sessions: SessionSearchResponse[];
    get sessions() {
        return this._sessions;
    }

    @Input() set sessions(sessions: SessionSearchResponse[]) {
        this._sessions = sessions;
        this.dataSource = new MatTableDataSource(sessions);
    };

    public readonly tableSettings$ = new BehaviorSubject<TableSetting>(SessionAmendmentTableComponent.DEFAULT_TABLE_SETTINGS);

    public resetToFirstPage() {
        this.paginator.firstPage()
    }

    emitTableSettings() {
        const sortByProperty = this.sort.active;
        const sortDirection = this.sort.direction;
        const pageIndex = this.paginator.pageIndex;
        const pageSize = this.paginator.pageSize || this.tableSettings$.getValue().pageSize;

        const newTableSettings = {sortByProperty, sortDirection, pageIndex, pageSize}
        this.tableSettings$.next(newTableSettings);
    }

    parseTime(date: string) {
        return moment(date).format('HH:mm');
    }

    parseDate(date: string) {
        return moment(date).format();
    }

    humanizeDuration(duration) {
        return formatDuration(moment.duration(duration));
    }
}

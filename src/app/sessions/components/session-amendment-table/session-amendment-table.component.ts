import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { formatDuration } from '../../../utils/date-utils';
import { SessionSearchResponse } from '../../models/session-search-response.model';
import { TableSetting } from '../../models/table-settings.model';
import { Subject } from 'rxjs';
import { SessionSearchColumn } from '../../models/session-search-column';
@Component({
    selector: 'app-session-amendment-table',
    templateUrl: './session-amendment-table.component.html',
    styleUrls: ['./session-amendment-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionAmendmentTableComponent implements AfterViewInit {
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
        SessionSearchColumn.Allocated,
        SessionSearchColumn.Utilisation,
        SessionSearchColumn.Available,
        SessionSearchColumn.Amend,
    ];

    dataSource: MatTableDataSource<any>;
    tableVisible = true;
    initialPageSize = 20
    sessionSearchColumns = SessionSearchColumn

    private _sessions: SessionSearchResponse[];
    get sessions() { return this._sessions; }
    @Input() set sessions(sessions: SessionSearchResponse[]) {
        this._sessions = sessions;
        this.dataSource = new MatTableDataSource(sessions);
    };

    public readonly tableSettings$ = new Subject<TableSetting>();

    ngAfterViewInit() {
        this.emitTableSettings()
    }

    emitTableSettings() {
        const sortByProperty = this.sort.active;
        const sortDirection = this.sort.direction;
        const pageIndex = this.paginator.pageIndex;
        const pageSize = this.paginator.pageSize || this.initialPageSize

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

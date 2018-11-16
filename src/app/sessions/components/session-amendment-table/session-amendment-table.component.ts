import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { formatDuration } from '../../../utils/date-utils';
import { SessionSearchResponse } from '../../models/session-search-response.model';
import { TableSetting } from '../../models/table-settings.model';
import { Subject } from 'rxjs';
import { SessionSearchColumns } from '../../models/session-search-columns';
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
        SessionSearchColumns.SessionId,
        SessionSearchColumns.PersonName,
        SessionSearchColumns.StartTime,
        SessionSearchColumns.StartDate,
        SessionSearchColumns.Duration,
        SessionSearchColumns.RoomName,
        SessionSearchColumns.SessionTypeDescription,
        SessionSearchColumns.NoOfHearingPartsAssignedToSession,
        SessionSearchColumns.Allocated,
        SessionSearchColumns.Utilisation,
        SessionSearchColumns.Available,
        SessionSearchColumns.Amend,
    ];

    dataSource: MatTableDataSource<any>;
    tableVisible = true;
    initialPageSize = 20
    sessionSearchColumns = SessionSearchColumns

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

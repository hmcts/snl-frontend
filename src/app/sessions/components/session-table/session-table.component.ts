import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionForListingWithNotes } from '../../models/session.viewmodel';
import { formatDuration } from '../../../utils/date-utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableSettings } from '../../../hearing-part/models/table-settings.model';
import { SessionSearchColumn } from '../../models/session-search-column';

@Component({
    selector: 'app-session-table',
    templateUrl: './session-table.component.html',
    styleUrls: ['./session-table.component.scss']
})
export class SessionTableComponent implements OnChanges, OnInit {
    public static DEFAULT_TABLE_SETTINGS: TableSettings = {
        pageSize: 10,
        pageIndex: 0,
        sortByProperty: 'start_time',
        sortDirection: 'asc'
    };

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    @Output() selectSessions = new EventEmitter();
    @Output() viewNotes = new EventEmitter();

    @Input() sessions: SessionForListingWithNotes[];
    @Input() totalCount: number;

    tableSettingsSource$: BehaviorSubject<TableSettings> = new BehaviorSubject<TableSettings>(SessionTableComponent.DEFAULT_TABLE_SETTINGS);
    selectedSessionIds: SelectionModel<string>;
    selectedSessions: SessionForListingWithNotes[] = [];

    sessionSearchColumns = SessionSearchColumn
    displayedColumns = [
        SessionSearchColumn.SessionTypeDescription,
        SessionSearchColumn.StartDate,
        SessionSearchColumn.StartTime,
        SessionSearchColumn.PersonName,
        SessionSearchColumn.RoomName,
        SessionSearchColumn.NoOfHearingPartsAssignedToSession,
        SessionSearchColumn.Utilisation,
        'notes',
        SessionSearchColumn.Available,
        SessionSearchColumn.Duration,
        SessionSearchColumn.AllocatedDuration,
        'select_session'
    ];

    dataSource: MatTableDataSource<any>;
    tableVisible;

    constructor() {
        this.selectedSessionIds = new SelectionModel<string>(true, []);
        this.tableVisible = false;

        this.dataSource = new MatTableDataSource(this.sessions);
    }

    hasNotes(session: SessionForListingWithNotes): boolean {
        return session.notes.length > 0;
    }

    showNotes(session: SessionForListingWithNotes): void {
        if (this.hasNotes(session)) {
            this.viewNotes.emit(session);
        }
    }

    parseTime(date: moment.Moment) {
        return date.format('HH:mm');
    }

    humanizeDuration(duration) {
        return formatDuration(moment.duration(duration));
    }

    toggleSession(id: string) {
        this.selectedSessionIds.toggle(id);
        let tempSelectedSessions = this.toggleSelectedSessions(id, this.selectedSessionIds.isSelected(id));
        this.selectSessions.emit(tempSelectedSessions);
    }

    isChecked(id: string) {
        return this.selectedSessionIds.isSelected(id);
    }

    // Adds to the array selected sessions and removes the unselected ones.
    toggleSelectedSessions(id: string, selected: boolean): SessionForListingWithNotes[] {
        let sessionToToggle = this.selectedSessions.find(s => s.sessionId === id)
        if (sessionToToggle !== undefined) {
            if (!selected) {
                this.selectedSessions.splice(this.selectedSessions.findIndex(s => s.sessionId === id), 1);
            }
        } else {
            if (selected) {
                this.selectedSessions.push(this.sessions.find(s => s.sessionId === id));
            }
        }

        return this.selectedSessions;
    }

    clearSelection() {
        this.selectedSessionIds.clear();
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(Object.values(this.sessions));
    }

    ngOnChanges() {
        if (this.sessions) {
            this.tableVisible = true;
            this.dataSource = new MatTableDataSource(this.sessions);
        }
    }

    nextTableSettingsValue() {
        const ts: TableSettings = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sortByProperty: this.sort.active,
            sortDirection: this.sort.direction
        };

        this.tableSettingsSource$.next(ts)
    }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionForListingWithNotes } from '../../models/session.viewmodel';
import { formatDuration } from '../../../utils/date-utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableSettings } from '../../../hearing-part/models/table-settings.model';

@Component({
    selector: 'app-session-table',
    templateUrl: './session-table.component.html',
    styleUrls: ['./session-table.component.scss']
})
export class SessionTableComponent implements OnChanges, OnInit {
    public static DEFAULT_TABLE_SETTINGS: TableSettings = {
        pageSize: 10,
        pageIndex: 0,
        sortByProperty: 'session_type_description',
        sortDirection: 'asc'
    };

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    @Output() selectSessions = new EventEmitter();
    @Output() viewNotes = new EventEmitter();

    @Input() sessions: SessionForListingWithNotes[];
    @Input() totalCount: number;

    tableSettingsSource$: BehaviorSubject<TableSettings> = new BehaviorSubject<TableSettings>(SessionTableComponent.DEFAULT_TABLE_SETTINGS);

    selectedSesssions: SelectionModel<SessionForListingWithNotes>;
    displayedColumns = [
        'session_type_description',
        'start_date',
        'start_time',
        'person_name',
        'room_name',
        'no_of_hearing_parts_assigned_to_session',
        'utilization',
        'notes',
        'available',
        'duration',
        'allocated',
        'select_session'
    ];

    dataSource: MatTableDataSource<any>;
    tableVisible;

    constructor() {
        this.selectedSesssions = new SelectionModel<SessionForListingWithNotes>(true, []);

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

    toggleSession(session: SessionForListingWithNotes) {
        this.selectedSesssions.toggle(session);
        this.selectSessions.emit(this.selectedSesssions.selected)
    }

    clearSelection() {
        this.selectedSesssions.clear();
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

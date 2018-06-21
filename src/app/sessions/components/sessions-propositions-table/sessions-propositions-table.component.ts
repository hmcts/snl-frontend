import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SessionPropositionView } from '../../models/session-proposition-view.model';

@Component({
    selector: 'app-sessions-propositions-table',
    templateUrl: './sessions-propositions-table.component.html',
    styleUrls: ['./sessions-propositions-table.component.scss']
})
export class SessionsPropositionsTableComponent implements OnChanges {

    @Input() sessionPropositions: SessionPropositionView[];
    @Output() onSessionCreate = new EventEmitter<SessionPropositionView>();

    displayedColumns = [
        'date',
        'startTime',
        'endTime',
        'availibility',
        'judge',
        'room',
        'actions'
    ];
    dataSource: MatTableDataSource<SessionPropositionView>;
    tableVisible: boolean;

    constructor() {
    }

    ngOnChanges() {
        if (this.sessionPropositions) {
            this.tableVisible = true;
            this.dataSource = new MatTableDataSource(this.sessionPropositions);
        }
    }

    createSessionClicked(element: SessionPropositionView) {
        if (this.onSessionCreate !== undefined) {
            this.onSessionCreate.emit(element);
        }
    }

}

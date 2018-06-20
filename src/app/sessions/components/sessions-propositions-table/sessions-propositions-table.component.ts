import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SessionPropositionView } from '../../models/session-proposition-view.model';

@Component({
    selector: 'app-sessions-propositions-table',
    templateUrl: './sessions-propositions-table.component.html',
    styleUrls: ['./sessions-propositions-table.component.scss']
})
export class SessionsPropositionsTableComponent implements OnChanges {

    @Input() sessionPropositions: SessionPropositionView[];

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

    createSession(element: SessionPropositionView) {
        // TODO implement this in another story
        console.log(element);
    }

}

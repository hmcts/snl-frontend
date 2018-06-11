import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.state';
import { SearchForDates, } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { DetailsDialogComponent } from '../../sessions/components/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionDialogDetails } from '../../sessions/models/session-dialog-details.model';

@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html'
})
export class PlannerComponent implements OnInit {

    public view: string;
    private lastSearchDateRange: SessionQueryForDates;

    constructor(private store: Store<State>, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.setRoomView();
    }

    public setRoomView() {
        this.view = 'room';
        this.loadDataForAllJudges(this.lastSearchDateRange);
    }

    public setJudgeView() {
        this.view = 'judge';
        this.loadDataForAllJudges(this.lastSearchDateRange);
    }

    private loadDataForAllJudges(query: SessionQueryForDates) {
        if (query === undefined) { return; }
        this.store.dispatch(new SearchForDates(query));
        this.lastSearchDateRange = query;
    }

    public eventClick(session) {
        console.log(session);
        this.dialog.open(DetailsDialogComponent, {
            width: 'auto',
            minWidth: 350,
            data: new SessionDialogDetails(session),
            hasBackdrop: false
        });
    }
}

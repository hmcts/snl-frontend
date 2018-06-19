import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.state';
import { SearchForDates, } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { DetailsDialogComponent } from '../../sessions/components/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionDialogDetails } from '../../sessions/models/session-dialog-details.model';
import * as fromSessions from '../../sessions/reducers/index';
import { SessionEditOrCreateDialogComponent } from '../../sessions/components/session-edit-or-create-dialog/session-edit-or-create-dialog.component';
import { SessionCreate } from '../../sessions/models/session-create.model';
import * as moment from 'moment';

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
        if (query === undefined) {
            return;
        }
        this.store.dispatch(new SearchForDates(query));
        this.lastSearchDateRange = query;
    }

    public eventClick(eventId) {
        if (eventId instanceof CustomEvent) {
            return;
        }
        this.store.pipe(select(fromSessions.getSessionById(eventId)))
            .subscribe(session => {
                this.dialog.open(DetailsDialogComponent, {
                    width: 'auto',
                    minWidth: 350,
                    data: new SessionDialogDetails(session),
                    hasBackdrop: false
                });
            }).unsubscribe();
    }

    public newSession() {
        return this.dialog.open(SessionEditOrCreateDialogComponent, {
            width: 'auto',
            minWidth: 350,
            data: {
                userTransactionId: undefined,
                id: undefined,
                start: moment().toDate(),
                duration: 5000,
                roomId: null,
                personId: null,
                caseType: 'FTRACK',
            } as SessionCreate,
            hasBackdrop: true
        });
    }

}

import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.state';
import { SearchForDates, } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { DetailsDialogComponent } from '../../sessions/components/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionDialogDetails } from '../../sessions/models/session-dialog-details.model';
import * as fromSessions from '../../sessions/reducers/index';
import { DialogWithActionsComponent } from '../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { SessionsCreationService } from '../../sessions/services/sessions-creation.service';
import * as SessionActions from '../../sessions/actions/session.action';
import { v4 as uuid } from 'uuid';
import { SessionCreate } from '../../sessions/models/session-create.model';
import * as moment from 'moment';
import { SessionsCreateDialogComponent } from '../../sessions/components/sessions-create-dialog/sessions-create-dialog.component';

@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html'
})
export class PlannerComponent implements OnInit {

    public view: string;
    private lastSearchDateRange: SessionQueryForDates;
    private confirmationDialogRef;
    private confirmationDialogOpen;

    constructor(private store: Store<State>, public dialog: MatDialog, public sessionCreationService: SessionsCreationService) {
        this.confirmationDialogOpen = false;
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

    public eventModify(event) {
        if (!this.confirmationDialogOpen) {
            this.confirmationDialogRef = this.dialog.open(DialogWithActionsComponent, {
                width: 'auto',
                minWidth: 350,
                data: {
                    message: 'Are you sure you want to modify this session?'
                },
                hasBackdrop: true
            });

            this.confirmationDialogOpen = true;

            this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    let sessionUpdate = {
                        id: event.detail.event.id,
                        start: event.detail.event.start.toDate(),
                        duration: moment.duration(event.detail.event.end.diff(event.detail.event.start)).asSeconds(),
                    };

                    this.sessionCreationService.update(sessionUpdate);
                    this.dialog.open(SessionsCreateDialogComponent, {
                        width: 'auto',
                        minWidth: 350,
                        hasBackdrop: true
                    });
                    this.confirmationDialogOpen = false;
                } else {
                    event.detail.revertFunc();
                    this.confirmationDialogOpen = false;
                }
            });
        }
    }
}

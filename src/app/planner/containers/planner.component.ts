import { Component, OnInit } from '@angular/core';
import { select, Store, ActionsSubject } from '@ngrx/store';
import { State } from '../../app.state';
import { SearchForDates, } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { DetailsDialogComponent } from '../../sessions/components/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionDialogDetails } from '../../sessions/models/session-dialog-details.model';
import * as fromSessions from '../../sessions/reducers/index';
import { DialogWithActionsComponent } from '../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { SessionsCreationService } from '../../sessions/services/sessions-creation.service';
import * as moment from 'moment';
import { TransactionDialogComponent } from '../../sessions/components/transaction-dialog/transaction-dialog.component';
import * as sessionTransactionActs from '../../sessions/actions/transaction.action';

@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html'
})
export class PlannerComponent implements OnInit {

    public view: string;
    private lastSearchDateRange: SessionQueryForDates;
    private confirmationDialogRef;
    private confirmationDialogOpen;

    constructor(private store: Store<State>,
                public dialog: MatDialog,
                public sessionCreationService: SessionsCreationService,
                public updates$: ActionsSubject) {
        this.confirmationDialogOpen = false;

        this.updates$.subscribe(data => {
            if (data.type === sessionTransactionActs.EntityTransactionActionTypes.TransactionConflicted) {
                this.loadDataForAllJudges(this.lastSearchDateRange)
            }
        });
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
            this.confirmationDialogRef = this.openConfirmationDialog();

            this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    this.sessionCreationService.update(this.buildSessionUpdate(event));

                    this.openSummaryDialog();
                } else {
                    event.detail.revertFunc();
                }
                this.confirmationDialogOpen = false;
            });
        }
    }

    private buildSessionUpdate(event) {
        return {
            id: event.detail.event.id,
            start: event.detail.event.start.toDate(),
            duration: moment.duration(event.detail.event.end.diff(event.detail.event.start)).asSeconds(),
        };
    }

    private openConfirmationDialog() {
        this.confirmationDialogOpen = true;

        return this.dialog.open(DialogWithActionsComponent, {
            width: 'auto',
            minWidth: 350,
            data: {
                message: 'Are you sure you want to modify this session?'
            },
            hasBackdrop: true
        });
    }

    private openSummaryDialog() {
        this.confirmationDialogOpen = true;

        this.dialog.open(TransactionDialogComponent, {
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { State } from '../../app.state';
import { SearchForDates, } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { DetailsDialogComponent } from '../../sessions/components/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionDialogDetails } from '../../sessions/models/session-dialog-details.model';
import * as fromSessions from '../../sessions/reducers/index';
import * as moment from 'moment';
import { DialogWithActionsComponent } from '../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { SessionsCreationService } from '../../sessions/services/sessions-creation.service';
import { TransactionDialogComponent } from '../../sessions/components/transaction-dialog/transaction-dialog.component';
import * as sessionTransactionActs from '../../sessions/actions/transaction.action';
import { SessionAssignment } from '../../hearing-part/models/session-assignment';
import { HearingPartModificationService } from '../../hearing-part/services/hearing-part-modification-service';
import { v4 as uuid } from 'uuid';

@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html'
})
export class PlannerComponent implements OnInit {

    public view: string;
    private lastSearchDateRange: SessionQueryForDates;
    private confirmationDialogRef;
    private confirmationDialogOpen;
    private selectedSessionId;

    constructor(private store: Store<State>,
                public dialog: MatDialog,
                public sessionCreationService: SessionsCreationService,
                public hearingModificationService: HearingPartModificationService,
                public updates$: ActionsSubject) {
        this.confirmationDialogOpen = false;

        this.updates$.subscribe(data => {
            if (data.type === sessionTransactionActs.EntityTransactionActionTypes.TransactionConflicted) {
                this.loadDataForAllJudges(this.lastSearchDateRange);
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
        this.dialog.open(DetailsDialogComponent, {
            width: 'auto',
            minWidth: 350,
            data: new SessionDialogDetails(this.store.pipe(select(fromSessions.getSessionViewModelById(eventId)))),
            hasBackdrop: false
        });
    }

    public eventModify(event) {
        if (!this.confirmationDialogOpen) {
            this.confirmationDialogRef = this.openConfirmationDialog();
            this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    let sessionVersion$ = this.store.pipe(select(fromSessions.getSessionById(event.detail.event.id)))
                        .map(session => {
                            return session.version;
                        });
                    this.sessionCreationService.update(this.buildSessionUpdate(event), sessionVersion$);

                    let sucess$ = this.store.select(fromSessions.haveUpdateSucceed).subscribe(succeeded => {
                        if (succeeded) {
                            this.openSummaryDialog();

                            sucess$.unsubscribe();
                            failure$.unsubscribe();
                        }
                    });
                    let failure$ = this.store.select(fromSessions.haveUpdateFailed).subscribe(failed => {
                        if (failed) {
                            event.detail.revertFunc();
                            this.store.select(fromSessions.getSessionsError).subscribe(error => {
                                this.openCreationFailedDialog(error);
                            }).unsubscribe();

                            sucess$.unsubscribe();
                            failure$.unsubscribe();
                        }
                    });
                } else {
                    event.detail.revertFunc();
                }
                this.confirmationDialogOpen = false;
            });
        }
    }

    public drop(event) {
        let selectedSessionId = this.selectedSessionId;

        if (!this.confirmationDialogOpen) {
            this.confirmationDialogRef = this.openConfirmationDialog();
            this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
                this.confirmationDialogOpen = false;
                if (confirmed) {
                    this.hearingModificationService.assignHearingPartWithSession({
                        hearingPartId: event.detail.jsEvent.target.getAttribute('data-hearingid'),
                        userTransactionId: uuid(),
                        sessionId: selectedSessionId,
                        start: null
                    } as SessionAssignment);
                    this.openSummaryDialog();
                }
            });
        }
    }

    public eventMouseOver(event) {
        this.selectedSessionId = event.detail.event.id;
    }

    private buildSessionUpdate(event) {
        let [resourceType, resourceId] = event.detail.event.resourceId.split(/-(.+)/);
        resourceType += 'Id';

        return {
            id: event.detail.event.id,
            start: event.detail.event.start.toDate(),
            duration: moment.duration(event.detail.event.end.diff(event.detail.event.start)).asSeconds(),
            [resourceType]: resourceId,
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
        this.dialog.open(TransactionDialogComponent, {
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true
        });
    }

    private openCreationFailedDialog(error: any) {
        console.log(error);
        this.dialog.open(DialogWithActionsComponent, {
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true,
            data: {
                message: error.message,
                hideDecline: true
            }
        });
    }
}

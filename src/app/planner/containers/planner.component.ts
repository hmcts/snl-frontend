import { SummaryMessageService } from './../services/summary-message.service';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.state';
import { SearchForDates } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { DetailsDialogComponent } from '../../sessions/components/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionDialogDetails } from '../../sessions/models/session-dialog-details.model';
import * as fromSessions from '../../sessions/reducers';
import * as moment from 'moment';
import { DialogWithActionsComponent } from '../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { SessionsCreationService } from '../../sessions/services/sessions-creation.service';
import { TransactionDialogComponent } from '../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { SessionAssignment } from '../../hearing-part/models/session-assignment';
import { HearingPartModificationService } from '../../hearing-part/services/hearing-part-modification-service';
import { v4 as uuid } from 'uuid';
import * as fromHearingPartsActions from '../../hearing-part/actions/hearing-part.action';
import * as fromHearingParts from '../../hearing-part/reducers/index';
import { Separator } from '../../core/callendar/transformers/data-with-simple-resource-transformer';
import { SessionViewModel } from '../../sessions/models/session.viewmodel';
import { ITransactionDialogData } from '../../features/transactions/models/transaction-dialog-data.model';

@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html'
})
export class PlannerComponent implements OnInit {

    public view: string;
    public lastSearchDateRange: SessionQueryForDates;
    private confirmationDialogRef;
    private confirmationDialogOpen;
    public selectedSessionId;
    private latestEvent: any;
    public sessions: SessionViewModel[];
    public hearingParts: any[];

    constructor(private readonly store: Store<State>,
                public dialog: MatDialog,
                public sessionCreationService: SessionsCreationService,
                public hearingModificationService: HearingPartModificationService,
                private summaryMessageService: SummaryMessageService) {
        this.confirmationDialogOpen = false;
    }

    ngOnInit() {
        this.setRoomView();

        this.store.select(fromSessions.getFullSessions).subscribe(sessions => {
            this.sessions = sessions;
        });

        this.store.select(fromHearingParts.getFullHearingParts).subscribe(hearingParts => {
            this.hearingParts = hearingParts;
        });
    }

    public setRoomView() {
        this.view = 'room';
        this.loadDataForAllJudges(this.lastSearchDateRange);
    }

    public setJudgeView() {
        this.view = 'judge';
        this.loadDataForAllJudges(this.lastSearchDateRange);
    }

    public loadDataForAllJudges(query: SessionQueryForDates) {
        if (query === undefined) {
            return;
        }
        this.store.dispatch(new SearchForDates(query));
        this.lastSearchDateRange = query;
    }

    public fetchModifiedEntities() {
        this.sessionCreationService.fetchUpdatedEntities();
    }

    public eventClick(eventId) {
        if (eventId instanceof CustomEvent) {
            return;
        }
        const sessionViewModel = this.store.pipe(select(fromSessions.getSessionViewModelById(eventId)))
        this.dialog.open(DetailsDialogComponent, {
            width: 'auto',
            minWidth: 350,
            data: new SessionDialogDetails(sessionViewModel),
            hasBackdrop: false
        });
    }

    public eventModifyConfirmationClosed = (confirmed: boolean) => {
        if (confirmed) {
            this.sessionCreationService.update(this.buildSessionUpdate(this.latestEvent));

            this.openSummaryDialog().afterClosed().subscribe((success) => {
                if (!success) {
                    this.revertLatestEvent();
                }

                this.fetchModifiedEntities();
            });
        } else {
            this.revertLatestEvent();
        }

        this.confirmationDialogOpen = false;
    };

    public eventModify(event: CustomEvent) {
        if (!this.confirmationDialogOpen) {
            this.confirmationDialogRef = this.openConfirmationDialog();
            this.latestEvent = event;
            this.confirmationDialogRef.afterClosed().subscribe(this.eventModifyConfirmationClosed);
        }
    }

    public drop(event) {
        const selectedSessionId = this.selectedSessionId;

        if (!this.confirmationDialogOpen) {
            this.confirmationDialogRef = this.openConfirmationDialog();
            this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
                this.confirmationDialogOpen = false;
                if (confirmed) {
                    let hearingPartId = event.detail.jsEvent.target.getAttribute('data-hearingid');
                    this.hearingModificationService.assignHearingPartWithSession({
                        hearingPartId: hearingPartId,
                        hearingPartVersion: this.hearingParts.find(hp => hp.id === hearingPartId).version,
                        userTransactionId: uuid(),
                        sessionId: selectedSessionId,
                        sessionVersion: this.sessions.find(s => s.id === selectedSessionId).version,
                        start: null
                    } as SessionAssignment);

                    this.openSummaryDialog().afterClosed().subscribe(() => {
                        this.store.dispatch(new fromHearingPartsActions.GetById(hearingPartId));
                        this.fetchModifiedEntities();
                    });
                }
            });
        }
    }

    public eventMouseOver(event) {
        this.selectedSessionId = event.detail.event.id;
    }

    private buildSessionUpdate(event) {
        let [resourceType, resourceId] = event.detail.event.resourceId.split(`${Separator}`);
        resourceType += 'Id';

        return {
            id: event.detail.event.id,
            start: event.detail.event.start.toDate(),
            duration: moment.duration(event.detail.event.end.diff(event.detail.event.start)).asSeconds(),
            [resourceType]: resourceId,
        };
    }

    private revertLatestEvent() {
        if (this.latestEvent !== undefined) {
            this.latestEvent.detail.revertFunc();
        }
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
        return this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true,
            data: {
                summaryMsg$: this.summaryMessageService.buildSummaryMessage(this.latestEvent)
            }
        });
    }
}

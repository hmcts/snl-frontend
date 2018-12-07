import { HearingPartViewModel } from './../../hearing-part/models/hearing-part.viewmodel';
import { SummaryMessageService } from './../services/summary-message.service';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.state';
import { SearchForDates } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { DetailsDialogComponent } from '../../sessions/components/details-dialog/details-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SessionDialogDetails } from '../../sessions/models/session-dialog-details.model';
import * as fromSessions from '../../sessions/reducers';
import * as moment from 'moment';
import { DialogWithActionsComponent } from '../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { SessionsCreationService } from '../../sessions/services/sessions-creation.service';
import { TransactionDialogComponent } from '../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { DialogInfoComponent } from '../../features/notification/components/dialog-info/dialog-info.component';
import { HearingPartToSessionAssignment } from '../../hearing-part/models/hearing-to-session-assignment';
import { HearingModificationService } from '../../hearing-part/services/hearing-modification.service';
import { v4 as uuid } from 'uuid';
import * as fromHearingPartsActions from '../../hearing-part/actions/hearing-part.action';
import * as fromHearingParts from '../../hearing-part/reducers/index';
import { Separator } from '../../core/callendar/transformers/data-with-simple-resource-transformer';
import { SessionViewModel } from '../../sessions/models/session.viewmodel';
import { ITransactionDialogData } from '../../features/transactions/models/transaction-dialog-data.model';
import * as SessionActions from '../../sessions/actions/session.action';
import { DEFAULT_DIALOG_CONFIG } from '../../features/transactions/models/default-dialog-confg';
import { DragAndDropSession } from '../../sessions/models/drag-and-drop-session.model';
import { CalendarEventSessionViewModel } from '../types/calendar-event-session-view-model.type';
import { EventDrop } from '../../common/ng-fullcalendar/models/event-drop.model';
import { CalendarMouseEvent } from '../../common/ng-fullcalendar/models/calendar-mouse-event.model';
import { safe } from '../../utils/js-extensions';
import * as judgeActions from '../../judges/actions/judge.action';
import * as fromRoomActions from '../../rooms/actions/room.action';

@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html'
})
export class PlannerComponent implements OnInit {
    public view: string;
    public lastSearchDateRange: SessionQueryForDates;
    private confirmationDialogRef;
    private confirmationDialogOpen = false
    public selectedSessionId: string;
    private latestEvent: CalendarEventSessionViewModel;
    public sessions: SessionViewModel[] = [];
    public hearingParts: HearingPartViewModel[];

    constructor(private readonly store: Store<State>,
                public dialog: MatDialog,
                public sessionCreationService: SessionsCreationService,
                public hearingModificationService: HearingModificationService,
                private summaryMessageService: SummaryMessageService) {
    }

    ngOnInit() {
        this.store.dispatch(new judgeActions.Get());
        this.store.dispatch(new fromRoomActions.Get());

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
        this.searchSessions(this.lastSearchDateRange);
    }

    public setJudgeView() {
        this.view = 'judge';
        this.searchSessions(this.lastSearchDateRange);
    }

    public searchSessions(query: SessionQueryForDates) {
        if (query === undefined) {
            return;
        }
        this.store.dispatch(new SearchForDates(query));
        this.lastSearchDateRange = query;
    }

    public fetchModifiedEntities() {
        this.sessionCreationService.fetchUpdatedEntities();
    }

    public eventClick(eventId: CustomEvent<CalendarMouseEvent> | string) {
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

    public eventModify(event: CalendarEventSessionViewModel) {
        if (!this.confirmationDialogOpen) {
            this.confirmationDialogRef = this.openConfirmationDialog();
            this.latestEvent = event;
            this.confirmationDialogRef.afterClosed().subscribe(this.eventModifyConfirmationClosed);
        }
    }

    public drop(event: CustomEvent<EventDrop>) {
        this.latestEvent = event as any;
        let hearingPartId = event.detail.jsEvent.target.getAttribute('data-hearingid');
        let isNotMultiSession = !this.hearingParts.find(hp => hp.id === hearingPartId).multiSession;

        if (!this.confirmationDialogOpen) {
            this.confirmationDialogRef = isNotMultiSession ? this.openConfirmationDialog() : this.openMultiSessionDialog();
            this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
                this.confirmationDialogOpen = false;
                if (isNotMultiSession && confirmed) {
                    this.updateHearingPart(hearingPartId)
                }
            });
        }
    }

    public eventMouseOver(event: CalendarEventSessionViewModel) {
        this.selectedSessionId = event.detail.event.id;
    }

    private eventModifyConfirmationClosed = (confirmed: boolean) => {
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

    private updateHearingPart(hearingPartId: string) {
        const selectedSessionId = this.selectedSessionId;
        this.hearingModificationService.assignWithSession({
            hearingPartId: hearingPartId,
            hearingPartVersion: this.hearingParts.find(hp => hp.id === hearingPartId).version,
            userTransactionId: uuid(),
            sessionData: {
                sessionId: selectedSessionId,
                sessionVersion: this.sessions.find(s => s.id === selectedSessionId).version
            },
            start: null
        } as HearingPartToSessionAssignment);

        this.openSummaryDialog().afterClosed().subscribe(() => {
            this.store.dispatch(new fromHearingPartsActions.GetById(hearingPartId));
            this.store.dispatch(new SessionActions.Get(selectedSessionId));
        });
    }

    private buildSessionUpdate(event: CalendarEventSessionViewModel): DragAndDropSession {
        let personId = safe(() => event.detail.event.person.id);
        let roomId = safe(() => event.detail.event.room.id);

        let [resourceType, resourceId] = event.detail.event.resourceId.split(`${Separator}`);
        if (resourceType === 'person') {
            personId = resourceId
        } else {
            roomId = resourceId
        }

        return {
            sessionId: event.detail.event.id,
            start: event.detail.event.start.toDate(),
            durationInSeconds: moment.duration(event.detail.event.end.diff(event.detail.event.start)).asSeconds(),
            personId,
            roomId,
            version: event.detail.event.version
        };
    }

    private revertLatestEvent() {
        if (this.latestEvent !== undefined) {
            this.latestEvent.detail.revertFunc();
        }
    }

    private openMultiSessionDialog(): MatDialogRef<DialogInfoComponent> {
        this.confirmationDialogOpen = true;

        return this.dialog.open(DialogInfoComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: 'This is a multi-session hearing and you cannot move just part of it.'
        });
    }

    private openConfirmationDialog(): MatDialogRef<DialogWithActionsComponent> {
        this.confirmationDialogOpen = true;

        return this.dialog.open(DialogWithActionsComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: {
                message: 'Are you sure you want to modify this session?'
            }
        });
    }

    private openSummaryDialog() {
        return this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: {
                summaryMsg$: this.summaryMessageService.buildSummaryMessage(this.latestEvent)
            }
        });
    }
}

import { Component, OnInit, NgZone } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromReducer from '../../../sessions/reducers';
import { SearchForDates, SearchForJudgeWithHearings, } from '../../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../../sessions/models/session-query.model';
import { SessionViewModel, SessionCalendarViewModel } from '../../../sessions/models/session.viewmodel';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from '../../../security/services/security.service';
import { DiaryLoadParameters } from '../../../sessions/models/diary-load-parameters.model';
import { DetailsDialogComponent } from '../../../sessions/components/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionDialogDetails } from '../../../sessions/models/session-dialog-details.model';
import { DefaultDataTransformer } from '../transformers/default-data-transformer';
import * as judgeActions from '../../../judges/actions/judge.action';
import * as fromRoomActions from '../../../rooms/actions/room.action';
import { IcalendarTransformer } from '../transformers/icalendar-transformer';
import { CalendarEventSessionViewModel } from '../../../planner/types/calendar-event-session-view-model.type';

@Component({
    selector: 'app-calendar-container',
    templateUrl: './calendar-container.component.html',
    styleUrls: []
})
export class CalendarContainerComponent implements OnInit {

    sessions$: Observable<SessionViewModel[]>;
    loadData: (query: SessionQueryForDates) => void;
    readonly dataTransformer: IcalendarTransformer<SessionViewModel, SessionCalendarViewModel>;

    constructor(private readonly store: Store<State>,
                private readonly route: ActivatedRoute,
                private readonly security: SecurityService,
                public dialog: MatDialog,
                private zone: NgZone) {
        this.dataTransformer = new DefaultDataTransformer();
        this.sessions$ = this.store.select(fromReducer.getFullSessions);
        // Due full calendar is not included in angular detection mechanism
        // it wasn't showing up session on first view
        this.sessions$.subscribe(() => this.zone.run(() => { /* no op */ }));
    }

    ngOnInit() {
        this.store.dispatch(new judgeActions.Get());
        this.store.dispatch(new fromRoomActions.Get());

        this.route.data.subscribe((data) => {
            this.loadData = data.forSpecificJudge ? this.loadDataForJudge : this.loadDataForAllJudges;
        });
    }

    private loadDataForAllJudges(query: SessionQueryForDates) {
        this.store.dispatch(new SearchForDates(query));
    }

    private loadDataForJudge(query: DiaryLoadParameters) {
        query.judgeUsername = this.security.getCurrentUser().username;

        this.store.dispatch(new SearchForJudgeWithHearings(query));
    }

    public eventClick(event: CalendarEventSessionViewModel) {
        this.dialog.open(DetailsDialogComponent, {
            width: 'auto',
            minWidth: 350,
            data: new SessionDialogDetails(this.store.pipe(select(fromReducer.getSessionViewModelById(event.detail.event.id)))),
            hasBackdrop: false
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromReducer from '../../../sessions/reducers/index';
import {
    SearchForDates, SearchForJudgeWithHearings,
} from '../../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../../sessions/models/session-query.model';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { ActivatedRoute } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { SecurityService } from '../../../security/services/security.service';
import { DiaryLoadParameters } from '../../../sessions/models/diary-load-parameters.model';

@Component({
    selector: 'app-core-callendar-container',
    templateUrl: './calendar-container.component.html',
    styleUrls: []
})
export class CalendarContainerComponent implements OnInit {

    sessions$: Observable<SessionViewModel[]>;
    loadData;

    constructor(private store: Store<State>, private route: ActivatedRoute, private actions$: Actions, private security: SecurityService) {
        this.sessions$ = this.store.select(fromReducer.getFullSessions);
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.loadData = data.forSpecificJudge ? this.loadDataForJudge : this.loadDataForAllJudges;
        });
    }

    private loadDataForAllJudges(query: SessionQueryForDates) {
        this.store.dispatch(new SearchForDates(query));
    }

    private loadDataForJudge(query: DiaryLoadParameters) {
        query.judgeUsername = this.security.currentUser.username;

        this.store.dispatch(new SearchForJudgeWithHearings(query));
    }
}

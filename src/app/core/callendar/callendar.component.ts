import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options, ViewObject } from 'fullcalendar';
import { Store } from '@ngrx/store';
import { State } from '../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromReducer from '../../sessions/reducers/index';
import * as moment from 'moment';
import { SearchForDates } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { SessionViewModel } from '../../sessions/models/session.viewmodel';

@Component({
    selector: 'app-core-callendar',
    templateUrl: './callendar.component.html',
    styleUrls: ['./callendar.component.scss']
})
export class CallendarComponent implements OnInit {

    calendarOptions: Options;
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
    sessions$: Observable<SessionViewModel[]>;
    events: any[] = [];
    errors: string;

    constructor(private store: Store<State>) {
        this.sessions$ = this.store.select(fromReducer.getFullSessions);

        this.sessions$.subscribe(sessions => {
            this.events = sessions;
        }, error => {
            this.errors = error;
        });
    }

    clickButton(model: any) {
        let view = this.ucCalendar.fullCalendar('getView') as ViewObject;
        let startDate = view.intervalStart.format('YYYY-MM-DD');
        let endDate = view.intervalEnd.format('YYYY-MM-DD');
        this.loadData(new Date(startDate), new Date(endDate));
    }

    ngOnInit() {
        this.calendarOptions = {
            defaultDate: '2018-04-26T08:00:00',
            defaultView: 'agendaWeek',
            editable: false,
            eventLimit: false,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listMonth'
            },
            eventDataTransform: this.dataTransformer
        };
        this.loadData();
    }

    private dataTransformer(session: SessionViewModel) {
        let judgeName = (session.person) ? session.person.name : 'No Judge';
        let roomName = (session.room) ? session.room.name : 'No Room';
        let caseType = (session.caseType) ? session.caseType : 'No Case type';
        return {
            title: roomName + ' - ' + judgeName + ' - ' + caseType,
            start: session.start,
            end: moment(session.start).add(moment.duration(session.duration)).toDate()
        };
    }

    private loadData(startDate?: Date, endDate?: Date) {
        startDate = startDate || new Date('2018-04-23');
        endDate = endDate || new Date('2018-04-29');

        let query: SessionQueryForDates = {startDate: startDate, endDate: endDate};
        this.store.dispatch(new SearchForDates(query));
    }
}

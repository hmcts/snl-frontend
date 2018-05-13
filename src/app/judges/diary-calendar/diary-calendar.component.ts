import { Component, OnInit, ViewChild } from '@angular/core';
import { Options, ViewObject } from 'fullcalendar';
import { CalendarComponent } from 'ng-fullcalendar';
import { Store } from '@ngrx/store';
import { State } from '../../app.state';
import * as fromSessions from '../../sessions/reducers/index';
import * as fromSessionActions from '../../sessions/actions/session.action';
import { Observable } from 'rxjs/Observable';
import { DiaryLoadParameters } from '../../sessions/models/diary-load-parameters.model';
import { SecurityService } from '../../security/services/security.service';
import * as moment from 'moment';
import { SessionViewModel } from '../../sessions/models/session.viewmodel';

@Component({
    selector: 'app-diary-calendar',
    templateUrl: './diary-calendar.component.html',
    styleUrls: ['./diary-calendar.component.scss']
})
export class DiaryCalendarComponent implements OnInit {

    calendarOptions: Options;
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
    sessions$: Observable<SessionViewModel[]>;
    events: any[] = [];
    errors: string;

    constructor(private store: Store<State>, private security: SecurityService) {
        this.sessions$ = this.store.select(fromSessions.getFullSessions);

        this.sessions$.subscribe(sessions => {
            this.events = sessions;
        }, error => {
            this.errors = error;
        });
    }

    clickButton(model: any) {
        console.log('CurrentView: ');
        let view = this.ucCalendar.fullCalendar('getView') as ViewObject;
        let startDate = view.intervalStart.format('YYYY-MM-DD');
        let endDate = view.intervalEnd.format('YYYY-MM-DD');
        console.log(startDate);
        console.log(endDate);
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
        let caseType = 'No Case type';
        return {
            title: roomName + ' - ' + judgeName + ' - ' + caseType,
            start: session.start,
            end: moment(session.start).add(moment.duration(session.duration)).toDate(),
            description: 'This is a BACKGROUND event test <br/> second line test <b> bolder test </b>'
        };
    }

    private loadData(startDate?: Date, endDate?: Date) {
        startDate = startDate || new Date('2018-04-23');
        endDate = endDate || new Date('2018-04-29');
        let params: DiaryLoadParameters = {
            judgeUsername: this.security.currentUser.username,
            startDate: startDate,
            endDate: endDate
        };
        this.store.dispatch(new fromSessionActions.SearchForJudge(params));
    }
}

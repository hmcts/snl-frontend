import { Component, OnInit, ViewChild } from '@angular/core';
import { Options } from 'fullcalendar';
import { CalendarComponent } from 'ng-fullcalendar';
import { select, Store } from '@ngrx/store';
import * as fromState from '../../app.state';
import * as fromReducer from '../reducers/index';
import { Session } from '../../sessions/models/session.model';
import { Observable } from 'rxjs/Observable';
import { Load } from '../actions/diary.actions';
import { DiaryLoadParameters } from '../models/diary-load-parameters.model';
import { SecurityService } from '../../security/services/security.service';
import { map } from 'rxjs/operators';
import * as moment from 'moment'
import { AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { State } from '../../app.state';

@Component({
    selector: 'app-diary-calendar',
    templateUrl: './diary-calendar.component.html',
    styleUrls: ['./diary-calendar.component.scss']
})
export class DiaryCalendarComponent implements OnInit {

    calendarOptions: Options;
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
    sessions$: Observable<Session[]>;
    events: any[] = [];

    constructor(private store: Store<State>, private security: SecurityService) {
        this.sessions$ = this.store.select(fromReducer.getSessionsEntities);

        this.sessions$.subscribe(sessions => {
            this.events = sessions;
        });
    }

    dataTransformer(session: Session) {
        console.log('in da transformer');
        console.log(session);
        return {
            title: session.room.name + ' - ' + session.judge.name,
            start: session.start,
            end: moment(session.start).add(session.duration).toDate(),
            description: 'This is a BACKGROUND event Conference <br/> second line test <b> bolder test </b>'
        }
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
            events: this.events,
            //     , {
            //     title: 'event2',
            //     start: '2018-04-19T13:00:00',
            //     end: '2018-04-19T16:00:00',
            //     backgroundColor: 'rgba(143, 223, 130, 0.3)',
            //     description: 'This is a cool event'
            //     // rendering: 'background'
            // }, {
            //     title: 'event3',
            //     start: '2018-04-19T13:00:00',
            //     end: '2018-04-19T16:00:00',
            //     backgroundColor: 'rgba(143, 223, 130, 0.3)',
            //     description: 'This is a cool event'
            //     // rendering: 'background'
            // }
            // eventRender: function (event, element) {
            //     alert(element);
            //     console.log(event);
            // },
            eventDataTransform: this.dataTransformer
        };

        this.loadData();

    }

    private loadData(startDate?: Date, endDate?: Date) {
        startDate = startDate || new Date('2018-04-23');
        endDate = endDate || new Date('2018-04-29');
        let params: DiaryLoadParameters = {
            judgeUsername: this.security.currentUser.username,
            startDate: startDate,
            endDate: endDate
        };
        this.store.dispatch(new Load(params));
    }
}

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromReducer from '../../sessions/reducers/index';
import * as moment from 'moment';
import { SearchForDates } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { SessionViewModel } from '../../sessions/models/session.viewmodel';
import { CalendarComponent } from '../../common/ng-fullcalendar/calendar.component';
import { OptionsInput } from 'fullcalendar/src/types/input-types';
import Default from 'fullcalendar/View';

@Component({
    selector: 'app-core-callendar',
    templateUrl: './callendar.component.html',
    styleUrls: ['./callendar.component.scss']
})
export class CallendarComponent implements OnInit {

  calendarOptions: OptionsInput;
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
    sessions$: Observable<SessionViewModel[]>;
    events: any[] = [];
    errors: string;

    constructor(private store: Store<State>) {
        this.sessions$ = this.store.select(fromReducer.getFullSessions);

        this.sessions$.subscribe(sessions => {
          this.events = this.transformSessions(sessions);
          console.log(sessions);
        }, error => {
            this.errors = error;
            console.log(error);
            console.log(this.events);
        });
    }

    clickButton(model: any) {
        console.log('CurrentView: ');
        let view = this.ucCalendar.fullCalendar('getView') as Default;
        let startDate = view.intervalStart.format('YYYY-MM-DD');
        let endDate = view.intervalEnd.format('YYYY-MM-DD');
        this.loadData(new Date(startDate), new Date(endDate));
    }

    ngOnInit() {
        this.calendarOptions = {
            defaultDate: '2018-04-26T08:00:00',
            defaultView: 'agendaWeek',
            editable: true,
            eventLimit: false,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listMonth'
            },
        };
        this.loadData();
    }

  private transformSessions(sessions: SessionViewModel[]) {
    let svm = [];

    sessions.forEach((session) => {
      svm.push(this.dataTransformer(session));
    });

    return svm;
  }

  private dataTransformer(session: SessionViewModel) {
        let judgeName = (session.person) ? session.person.name : 'No Judge';
        let roomName = (session.room) ? session.room.name : 'No Room';
        let caseType = (session.caseType) ? session.caseType : 'No Case type';
        return {
          id: session.id,
          duration: session.duration,
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

import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options, ViewObject } from 'fullcalendar';
import * as moment from 'moment';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';

@Component({
    selector: 'app-core-callendar',
    templateUrl: './callendar.component.html',
    styleUrls: ['./callendar.component.scss']
})
export class CallendarComponent implements OnInit {

    @Input() events: any[] = [];
    @Output() loadData = new EventEmitter();
    calendarOptions: Options;
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
    errors: string;
    references = [];

    constructor() {
    }

    clickButton(model: any) {
        this.loadData.emit(this.parseDates());
        this.references = [];
    }

    lol() {
        this.references.forEach(el => {
            let wordArray = el.innerHTML.split(' ');
            while (el.scrollHeight > el.offsetHeight) {
                wordArray.pop();
                el.innerHTML = wordArray.join(' ') + '...';
            }
        })
    }

    parseDates() {
        let view = this.ucCalendar.fullCalendar('getView') as ViewObject;
        let endDate = view.intervalEnd.format('YYYY-MM-DD') || new Date('2018-04-29');
        let startDate = view.intervalStart.format('YYYY-MM-DD') || new Date('2018-04-23');
        return {startDate: startDate, endDate: endDate};
    }

    ngOnInit() {
        this.calendarOptions = {
            defaultDate: '2018-05-17T08:00:00',
            defaultView: 'agendaDay',
            minTime: moment.duration('09:00:00'),
            maxTime: moment.duration('17:00:00'),
            editable: false,
            eventLimit: false,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listMonth'
            },
            eventDataTransform: this.dataTransformer,
        };

    }

    private dataTransformer(session: SessionViewModel) {
        let judgeName = (session.person) ? session.person.name : 'No Judge';
        let roomName = (session.room) ? session.room.name : 'No Room';
        let caseType = (session.caseType) ? session.caseType : 'No Case type';
        return {
            title: roomName + ' - ' + judgeName + ' - ' + caseType,
            start: session.start,
            end: moment(session.start).add(moment.duration(session.duration)).toDate(),
            id: session.id,
            hearingParts: session.hearingParts
        };
    }

    public eventRender(event) {
        let el = event.detail.element;
        event.detail.event.hearingParts.forEach(hearing => {
            el.append('</br>');
            el.append(hearing.caseTitle);
            el.append('  -  ' + hearing.hearingType);
            el.append('  -  ' + moment.duration(hearing.duration).asMinutes() + ' minutes');
        });

        el = el.get(0);
        this.references.push(el);
    }
}

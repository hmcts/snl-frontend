import { Component, OnInit, ViewChild } from '@angular/core';
import { Options } from 'fullcalendar';
import { CalendarComponent } from 'ng-fullcalendar';

@Component({
    selector: 'app-diary-calendar',
    templateUrl: './diary-calendar.component.html',
    styleUrls: ['./diary-calendar.component.scss']
})
export class DiaryCalendarComponent implements OnInit {

    calendarOptions: Options;
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

    constructor() {
    }

    ngOnInit() {
        this.calendarOptions = {
            defaultDate: '2018-04-18',
            defaultView: 'agendaWeek',
            editable: false,
            eventLimit: false,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listMonth'
            },
            events: [{
                title: 'event1',
                start: '2018-04-18T08:00:00',
                end: '2018-04-18T12:00:00',
                rendering: 'background',
                description: 'This is a BACKGROUND event Conference <br/> lalal druga linia <b> bolder </b>'
            }
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
            ],
            eventRender: function(event, element) {
                alert(element);
                console.log(event);
            }
        };
    }

}

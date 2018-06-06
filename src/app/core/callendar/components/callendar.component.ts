import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { CalendarComponent } from '../../../common/ng-fullcalendar/calendar.component';
import { Default } from 'fullcalendar/View';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';
import { AssignToSession } from '../../../hearing-part/actions/hearing-part.action';
import { Store } from '@ngrx/store';
import * as fromHearingParts from '../../../hearing-part/reducers';

@Component({
    selector: 'app-core-callendar',
    templateUrl: './callendar.component.html',
    styleUrls: ['./callendar.component.scss']
})
export class CallendarComponent implements OnInit, AfterViewInit {
    _events: any[];
    @Output() loadData = new EventEmitter();
    @Output() eventClickCallback = new EventEmitter();
    calendarOptions: any;
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
    errors: string;
    references = [];
    calHeight = 'auto';
    isSelected = false;
    selectedSessionId;

    @Input('events')
    set events(value: any[]) {
        this._events = this.transformSessions(value);
    }

    constructor(private store: Store<fromHearingParts.State>) {
    }

    clickButton(model: any) {
        this.loadData.emit(this.parseDates());
        this.references = [];
    }

    // A function for displaying ellipsis that can be used in further stories
    applyEllipsis() {
        this.references.forEach(el => {
            let wordArray = el.innerHTML.split(' ');
            while (el.scrollHeight > el.offsetHeight) {
                wordArray.pop();
                el.innerHTML = wordArray.join(' ') + '...';
            }
        })
    }

    parseDates() {
        let view = this.ucCalendar.fullCalendar('getView') as Default;
        let endDate = view.intervalEnd.format('YYYY-MM-DD') || new Date('2018-04-29');
        let startDate = view.intervalStart.format('YYYY-MM-DD') || new Date('2018-04-23');
        return {startDate: startDate, endDate: endDate};
    }

    ngOnInit() {
        this.calendarOptions = {
            // schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            height: this.calHeight,
            contentHeight: this.calHeight,
            defaultDate: moment().toDate(),
            defaultView: 'agendaDay',
            minTime: moment.duration('09:00:00'),
            maxTime: moment.duration('17:30:00'),
            editable: true,
            droppable: true,
            eventLimit: false,
            locale: 'en',
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listMonth'
            }
        };
        let today = moment().format('YYYY-MM-DD').toString();
        this.loadData.emit({startDate: today, endDate: today});
    }

    ngAfterViewInit() {
        ($('#TO') as any).draggable({
            revert: true
        });
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
            title: roomName + ' - ' + judgeName + ' - ' + caseType,
            start: session.start,
            end: moment(session.start).add(moment.duration(session.duration)).toDate(),
            id: session.id,
            hearingParts: session.hearingParts
        };
    }

    public eventRender(event) {
        let el = event.detail.element.css('overflow-y', 'auto');
        event.detail.event.hearingParts.forEach(hearing => {
            el.append('</br>');
            el.append(hearing.caseTitle);
            el.append('  -  ' + hearing.hearingType);
            el.append('  -  ' + moment.duration(hearing.duration).asMinutes() + ' minutes');
        });

        el = el.get(0);
        this.references.push(el);
    }

    public viewRender(event) {
        event.detail.element.find('div.fc-time-grid > div.fc-slats > table > tbody > tr > td').css('height', '50px');
        event.detail.element.find('div.fc-scroller').css('overflow-y', 'hidden !important');
    }

    public eventClick(event) {
        this.eventClickCallback.emit(this._events.find(element => element.id === event.detail.event.id));
    }

    public eventDrop(event) {
        console.log(event);
    }

    public eventResize(event) {
        console.log(event);
    }

    public drop(event) {
        if (this.isSelected) {
            this.store.dispatch(new AssignToSession({
                hearingPartId: event.detail.ui.helper[0].dataset.hearingid,
                sessionId: this.selectedSessionId,
                start: null // this.calculateStartOfHearing(this.selectedSession)
            }));
            event.detail.ui.helper[0].remove();
        }
        }

    public eventMouseOver(event) {
        this.isSelected = true;
        this.selectedSessionId = event.detail.event.id;
    }

    public eventMouseOut(event) {
        this.isSelected = false;
    }

    @HostListener('dragend', ['$event'])
    drag(e: DragEvent) {
    }
}

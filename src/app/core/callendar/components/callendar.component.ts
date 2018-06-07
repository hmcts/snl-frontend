import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { CalendarComponent } from '../../../common/ng-fullcalendar/calendar.component';
import { Default } from 'fullcalendar/View';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';
import { IcalendarTransformer } from '../transformers/icalendar-transformer';
import { AssignToSession } from '../../../hearing-part/actions/hearing-part.action';
import { Store } from '@ngrx/store';
import * as fromHearingParts from '../../../hearing-part/reducers';

@Component({
    selector: 'app-core-callendar',
    templateUrl: './callendar.component.html',
    styleUrls: ['./callendar.component.scss']
})
export class CallendarComponent implements OnInit, AfterViewInit {

    @Output() loadData = new EventEmitter();
    @Output() eventClickCallback = new EventEmitter();
    @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
    calendarOptions: any;
    errors: string;
    references = [];
    calHeight = 'auto';
    isSelected = false;
    selectedSessionId;

    private _events: any[];
    get events(): any[] {
        return this._events;
    }
    @Input('preTransformedData') set preTransformedData(value: any[]) {
        if (value === undefined || this.dataTransformer === undefined) {
            return;
        }
        let events = [];
        value.forEach((element) => {
            events.push(this.dataTransformer.transform(element));
        });
        this._events = events;
    }

    private _resources: any[] = [];
    @Input('resources')
    public set resources(value: any[]) {
        if (value === undefined) {
            return;
        }
        this._resources = value; // for initial load

        if (this.ucCalendar === undefined) {
            return;
        }
        value.forEach(element => { // in case something is set or added later / after subscription
            this.ucCalendar.fullCalendar('addResource', element, false);
        });
    }

    @Input() resourceColumns: any[] = [];
    @Input() dataTransformer: IcalendarTransformer<any>;
    @Input() defaultView: string;
    @Input() header: any;
    @Input() views: any;

    constructor(private store: Store<fromHearingParts.State>) {
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        };
        this.views = {};
        this.defaultView = 'agendaDay';
    }

    ngAfterViewInit() {
        ($('.draggable-hearing') as any).draggable({
            revert: true
        })
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
        });
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
            defaultDate: moment.now(),
            defaultView: this.defaultView,
            minTime: moment.duration('09:00:00'),
            maxTime: moment.duration('17:30:00'),
            editable: true,
            droppable: true,
            eventLimit: false,
            header: this.header,
            views: this.views,
            resourceColumns: this.resourceColumns,
            resources: this._resources
        };
        let today = moment().format('YYYY-MM-DD').toString();
        this.loadData.emit({startDate: today, endDate: today});
    }

    public eventRender(event) {
        // TODO extract this method somewhere outside of component, or at least data related parts
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
        this.eventClickCallback.emit(this.events.find(element => element.id === event.detail.event.id));
    }

    public eventDrop(event) {
        // event.detail.revertFunc();

        event.detail.event.start = moment(event.detail.event.start.format());
        event.detail.event.end = moment(event.detail.event.end.format());

        console.log(event);
    }

    public eventResize(event) {
        // event.detail.revertFunc();

        event.detail.event.start = moment(event.detail.event.start.format());
        event.detail.event.end = moment(event.detail.event.end.format());

        console.log(event)
    }

    public drop(event) {
        console.log(event)
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
        console.log('OVER')
        this.isSelected = true;
        this.selectedSessionId = event.detail.event.id;
    }

    public eventMouseOut(event) {
        console.log('OUT')
        this.isSelected = false;
    }
}

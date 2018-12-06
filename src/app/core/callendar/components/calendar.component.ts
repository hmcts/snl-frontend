import { AllowEvent } from './../../../common/ng-fullcalendar/models/allow-event.model';
import { IcalendarTransformer } from '../transformers/icalendar-transformer';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Default } from 'fullcalendar/View';
import { NgFullCalendarComponent } from '../../../common/ng-fullcalendar/ng-full-calendar.component';
import { formatDuration, formatDateTimeToHHmm } from '../../../utils/date-utils';
import { textToColor } from '../../../utils/color-text';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: [ './calendar.component.scss' ]
})
export class CalendarComponent implements OnInit {

    @ViewChild(NgFullCalendarComponent) public ucCalendar: NgFullCalendarComponent;
    calendarOptions: any;
    errors: string;
    references = [];
    calHeight = 'auto';
    events: any[];

    @Input('preTransformedData') set preTransformedData(value: any[]) {
        if (value === undefined || this.dataTransformer === undefined) {
            return;
        }
        let events = []; // NOSONAR typescript:S3353 not relevant
        value.forEach((element) => {
            events.push(this.dataTransformer.transform(element));
        });
        this.events = events;
    }

    public _resources: any[];
    @Input('resources')
    public set resources(value: any[]) {
        if (value === undefined) {
            return;
        }
        this._resources = value;

        if (this.ucCalendar === undefined) {
            return;
        }
        this.ucCalendar.fullCalendar('refetchResources');
    }

    @Input() editable = true;
    @Input() resourceColumns: any[] = undefined;
    @Input() dataTransformer: IcalendarTransformer<any>;
    @Input() defaultView: string;
    @Input() header: any;
    @Input() views: any;
    @Input() initialStartDate: Date = moment().toDate();
    @Output() loadData = new EventEmitter();
    @Output() eventClickCallback = new EventEmitter();
    @Output() eventResizeCallback = new EventEmitter();
    @Output() eventDropCallback = new EventEmitter();
    @Output() dropCallback = new EventEmitter();
    @Output() eventMouseOverCallback = new EventEmitter();
    @Output() eventAllowCallback = new EventEmitter<CustomEvent<AllowEvent>>();

    constructor() {
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        };
        this.views = {};
        this.defaultView = 'agendaDay';
    }

    ngOnInit() {
        this.calendarOptions = {
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
            height: this.calHeight,
            defaultDate: this.initialStartDate,
            contentHeight: this.calHeight,
            defaultView: this.defaultView,
            minTime: moment.duration('09:00:00'),
            maxTime: moment.duration('17:30:00'),
            editable: this.editable,
            droppable: true,
            eventLimit: false,
            header: this.header,
            views: this.views,
            titleFormat: 'DD/MM/YYYY',
            timezone: 'local'
        };
        // when there are defined resources, agendaDay view for a simple calendar may not work
        // another approach would be to create separate component for scheduler
        // fix bellow is related to a serios of issues on fullcalendar github,
        if (this.resourceColumns !== undefined) {
            this.calendarOptions.resourceColumns = this.resourceColumns;
            this.calendarOptions.resources = (callback) => {
                callback(this._resources);
            };
        }
    }

    public refreshViewData() {
        const dateRange = this.parseDates();
        if (dateRange === undefined) {
            return;
        }

        this.loadData.emit(dateRange);
    }

    public clickButton() {
        this.refreshViewData();
        this.references = [];
    }

    public eventRender(event) {
        // TODO extract this method somewhere outside of component, or at least data related parts
        let el = event.detail.element;
        el.css('background-color', textToColor(event.detail.event.sessionType.code));
        event.detail.event.hearingParts.forEach(hearing => {
            el.append('</br>');
            el.append(hearing.caseNumber);
            el.append('  -  ' + hearing.caseTitle);
            el.append('  -  ' + hearing.hearingType.description);
            el.append(`  -   ${formatDateTimeToHHmm(hearing.start)}`);
            el.append(`  -   ${formatDuration(hearing.duration)}`);
        });
        el.append('<span style="display: none;" id="' + event.detail.event.id + '"></span>');
        el = el.get(0);
        this.references.push(el);
    }

    public viewRender(event) {
        event.detail.element.find('div.fc-time-grid > div.fc-slats > table > tbody > tr > td').css('height', '50px');
        event.detail.element.find('div.fc-scroller').css('overflow-y', 'hidden !important');
    }

    public eventClick(event) {
        this.eventClickCallback.emit(event.detail.event.id);
    }

    public eventDrop(event) {
        this.emitWithUpdatedTime(this.eventDropCallback, event);
    }

    public drop(event) {
        this.dropCallback.emit(event);
    }

    public eventMouseOver(event) {
        this.eventMouseOverCallback.emit(event);
    }

    public eventResize(event) {
        this.emitWithUpdatedTime(this.eventResizeCallback, event);
    }

    public eventAllow(event: CustomEvent<AllowEvent>) {
        this.eventAllowCallback.emit(event);
    }

    private parseDates(): { startDate: moment.Moment, endDate: moment.Moment } {
        if (this.ucCalendar === undefined) {
            return undefined;
        }

        const view = this.ucCalendar.fullCalendar('getView') as Default;
        const endDate = view.intervalEnd;
        const startDate = view.intervalStart;

        return { startDate, endDate };
    }

    private emitWithUpdatedTime(eventCallback: any, event) {
        event.detail.event.start = moment(event.detail.event.start, 'DD/MM/YYYY[T]HH:mm:ss Z');
        event.detail.event.end = moment(event.detail.event.end, 'DD/MM/YYYY[T]HH:mm:ss Z');

        eventCallback.emit(event);
    }
}

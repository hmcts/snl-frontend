import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { CalendarComponent } from '../../../common/ng-fullcalendar/calendar.component';
import { Default } from 'fullcalendar/View';
import { IcalendarTransformer } from '../transformers/icalendar-transformer';

@Component({
    selector: 'app-core-callendar',
    templateUrl: './callendar.component.html',
    styleUrls: ['./callendar.component.scss']
})
export class CallendarComponent implements OnInit {

    @Output() loadData = new EventEmitter();
    @Output() eventClickCallback = new EventEmitter();
    @ViewChild(CalendarComponent) public ucCalendar: CalendarComponent;
    calendarOptions: any;
    errors: string;
    references = [];
    calHeight = 'auto';

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

    public _resources: any[] = [];
    @Input('resources')
    public set resources(value: any[]) {
        if (value === undefined) {
            return;
        }
        this._resources = value; // for initial load

        if (this.ucCalendar === undefined) {
            return;
        }
        this.ucCalendar.fullCalendar('refetchResources');
        // value.forEach(element => { // in case something is set or added later / after subscription
        //     this.ucCalendar.fullCalendar('addResource', element, false);
        // });
    }

    @Input() resourceColumns: any[] = [];
    @Input() dataTransformer: IcalendarTransformer<any>;
    @Input() defaultView: string;
    @Input() header: any;
    @Input() views: any;

    constructor() {
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        };
        this.views = {};
        this.defaultView = 'agendaDay';
    }

    public refreshViewData() {
        if ( this.loadData === undefined ) { return; }
        let dateRange = this.parseDates();
        if (dateRange === undefined) { return; }
        this.loadData.emit(dateRange);
    }

    clickButton(model: any) {
        this.refreshViewData();
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
        if ( this.ucCalendar === undefined ) { return undefined; }
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
            eventLimit: false,
            header: this.header,
            views: this.views,
            resourceColumns: this.resourceColumns,
            resources: (callback) => {
                    callback(this._resources);
            }
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

    private resourcesMethod() {

    }
}

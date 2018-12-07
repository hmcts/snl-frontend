import { Component, Input, Output, NgZone, AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import './lib/customEvent';
import { ButtonClickModel } from './models/buttonClickModel';
import { UpdateEventModel } from './models/updateEventModel';
import { RenderEventModel } from './models/renderEventModel';
import { CalendarMouseEvent } from './models/calendar-mouse-event.model'
import { EventObjectInput, OptionsInput } from 'fullcalendar/src/types/input-types';
import * as moment from 'moment';
import { EventDrop } from './models/event-drop.model';
import { View } from 'fullcalendar';

@Component({
    // tslint:disable-next-line
    selector: 'ng-fullcalendar',
    template: '',
})
export class NgFullCalendarComponent implements AfterViewInit {
    private _eventsModel: EventObjectInput[];
    private _reRender = true;
    get eventsModel(): EventObjectInput[] {
        return this._eventsModel;
    }

    @Input('eventsModel')
    set eventsModel(value: EventObjectInput[]) {
        this._eventsModel = value;
        if (this._reRender) {
            setTimeout(() => {
                this.renderEvents(value);
            }, 50);
        } else {
            this._reRender = true;
        }
    }
    @Output()
    eventsModelChange = new EventEmitter<any>();

    @Input() options: OptionsInput;
    @Output() eventDrop = new EventEmitter<CustomEvent<UpdateEventModel>>();
    @Output() eventResize = new EventEmitter<CustomEvent<UpdateEventModel>>();
    @Output() eventClick = new EventEmitter<CustomEvent<CalendarMouseEvent>>();
    @Output() clickButton = new EventEmitter<any>();
    @Output() windowResize = new EventEmitter<any>();
    @Output() viewRender = new EventEmitter<any>();
    @Output() viewDestroy = new EventEmitter<any>();
    @Output() eventRender = new EventEmitter<any>();
    @Output() initialized = new EventEmitter<any>();
    @Output() select = new EventEmitter<any>();
    @Output() unselect = new EventEmitter<any>();
    @Output() dayClick = new EventEmitter<any>();
    @Output() navLinkDayClick = new EventEmitter<any>();
    @Output() navLinkWeekClick = new EventEmitter<any>();
    @Output() drop = new EventEmitter<CustomEvent<EventDrop>>();
    @Output() eventMouseOver = new EventEmitter<CustomEvent<CalendarMouseEvent>>();
    @Output() eventMouseOut = new EventEmitter<CustomEvent<CalendarMouseEvent>>();

    constructor(private element: ElementRef, private zone: NgZone) {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.updaterOptions();
            this.zone.runOutsideAngular(() => {
                $(this.element.nativeElement).fullCalendar(this.options);
                this._eventsModel = this.options.events as EventObjectInput[];
                this.eventsModelChange.next(this.options.events);
                this.initialized.emit(true);
                // Click listeners
                let elem = document.getElementsByTagName('ng-fullcalendar');

                $('[class ^="fc"][class *="button"]').click(el => {
                    let classnames = el.currentTarget.className.split(' ');
                    classnames.forEach(name => {
                        if (name.indexOf('button') === name.length - 6) {
                            name = name.replace(/fc|button|-/g, '');
                            if (name !== '') {
                                this.renderEvents(this._eventsModel);
                                eventDispatch(name);
                            }
                        }
                    });
                });
                function eventDispatch(buttonType: string) {
                    let data = $('ng-fullcalendar').fullCalendar('getDate');
                    let currentDetail: ButtonClickModel = {
                        buttonType: buttonType,
                        data: data
                    };
                    let widgetEvent = new CustomEvent('clickButton', {
                        bubbles: true,
                        detail: currentDetail
                    });
                    for (let i = 0; i < elem.length; i++) {
                        elem[i].dispatchEvent(widgetEvent);
                    }
                }
            });
        }, );
    }

    updateEventsBeforeResize() {
        let events = this.fullCalendar('clientEvents');
        this._reRender = false;
        this.eventsModel = events;
        this.eventsModelChange.next(events);
    }

    updaterOptions() {
        let elem = document.getElementsByTagName('ng-fullcalendar');
        this.options.eventDrop = (event: EventObjectInput, delta: moment.Duration,
                                  revertFunc: Function, jsEvent: Event, ui: any, view: View) => {
            let detail: UpdateEventModel = { event: event, delta, revertFunc, jsEvent, ui, view };
            let widgetEvent = new CustomEvent<UpdateEventModel>('eventDrop', {
                bubbles: false,
                detail: detail
            });
            this.updateEventsBeforeResize();
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        this.options.eventResize = (event: EventObjectInput, delta: moment.Duration,
                                    revertFunc: Function, jsEvent: Event, ui: any, view: View) => {
            const duration =  delta ? delta : moment.duration(moment(event.end).diff(moment(event.start)));
            let detail: UpdateEventModel = { event: event, delta: duration, revertFunc: revertFunc, jsEvent, ui, view };
            let widgetEvent = new CustomEvent<UpdateEventModel>('eventResize', {
                bubbles: false,
                detail: detail
            });
            this.updateEventsBeforeResize();
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        this.options.eventRender = function (event: EventObjectInput, element: JQuery, view: View) {
            let detail: RenderEventModel = { event: event, element: element, view: view };
            let widgetEvent = new CustomEvent('eventRender', {
                bubbles: false,
                detail: detail
            });
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        this.options.eventClick = (event: EventObjectInput, jsEvent: MouseEvent, view: View) => {
            let detail: CalendarMouseEvent = { event, jsEvent, view };
            let widgetEvent = new CustomEvent<CalendarMouseEvent>('eventClick', {
                bubbles: false,
                detail: detail
            });
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        this.options.windowResize = function (view: View) {
            let detail = { view: view };
            let widgetEvent = new CustomEvent('windowResize', {
                bubbles: false,
                detail: detail
            });
            if (elem && elem[0]) {
                for (let i = 0; i < elem.length; i++) {
                    elem[i].dispatchEvent(widgetEvent);
                }
            }
        };
        this.options.viewRender = function (view: View, element: JQuery) {
            let detail = { view: view, element: element };
            let widgetEvent = new CustomEvent('viewRender', {
                bubbles: false,
                detail: detail
            });
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        this.options.viewDestroy = function (view: View, element: JQuery) {
            let detail = { view: view, element: element };
            let widgetEvent = new CustomEvent('viewDestroy', {
                bubbles: false,
                detail: detail
            });
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        this.options.select = function (start: any, end: any, jsEvent: MouseEvent, view: any, resource?: any) {
            let detail = { start: start, end: end, jsEvent: jsEvent, view: view, resource: resource };
            let widgetEvent = new CustomEvent('select', {
                bubbles: false,
                detail: detail
            });
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        this.options.unselect = function (view: any, jsEvent: Event) {
            let detail = { view: view, jsEvent: jsEvent };
            let widgetEvent = new CustomEvent('unselect', {
                bubbles: false,
                detail: detail
            });
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        this.options.dayClick = function (date: any, jsEvent: Event, view: any) {
            let detail = { date: date, jsEvent: jsEvent, view: view };
            let widgetEvent = new CustomEvent('dayClick', {
                bubbles: false,
                detail: detail
            });
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        this.options.navLinkDayClick = function (date: any, jsEvent: Event) {
            let detail = { date: date, jsEvent: jsEvent };
            let widgetEvent = new CustomEvent('navLinkDayClick', {
                bubbles: false,
                detail: detail
            });
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        this.options.navLinkWeekClick = function (weekStart: any, jsEvent: Event) {
            let detail = { weekStart: weekStart, jsEvent: jsEvent };
            let widgetEvent = new CustomEvent('navLinkWeekClick', {
                bubbles: false,
                detail: detail
            });
            for (let i = 0; i < elem.length; i++) {
                elem[i].dispatchEvent(widgetEvent);
            }
        };
        // based on docs https://fullcalendar.io/docs/drop
        // 'jsEvent holds the jQuery event, with information like mouse coordinates'
        // but in types definitions it expect to be MouseEvent, using *any* as in this case jQuery object is returned instead of MouseEvent
        // worth checking if others events also returns jQuery events
        this.options.drop = (date: moment.Moment, jsEvent: any, ui: any, resourceId?: any) => {
            let detail: EventDrop = { date: date, jsEvent: jsEvent, ui: ui, resourceId: resourceId };

            const widgetEvent = new CustomEvent<EventDrop>('drop', {
                bubbles: false,
                detail: detail
            });
            // probably need to add an event - not handled!
            elem[0].dispatchEvent(widgetEvent);
        };
        this.options.eventMouseover = (event: EventObjectInput, jsEvent: MouseEvent, view: View) => {
            let detail: CalendarMouseEvent = { event, jsEvent, view };
            const widgetEvent = new CustomEvent<CalendarMouseEvent>('eventMouseOver', {
                bubbles: false,
                detail: detail
            });
            elem[0].dispatchEvent(widgetEvent);
        };
        this.options.eventMouseout = (event: EventObjectInput, jsEvent: MouseEvent, view: View) => {
            let detail: CalendarMouseEvent = { event, jsEvent, view };
            const widgetEvent = new CustomEvent<CalendarMouseEvent>('eventMouseOut', {
                bubbles: false,
                detail: detail
            });
            elem[0].dispatchEvent(widgetEvent);
        };
    }

    fullCalendar(...args: any[]): any {
        if (!args) {
            return;
        }
        switch (args.length) {
            case 0:
                return;
            case 1:
                return $(this.element.nativeElement).fullCalendar(args[0]);
            case 2:
                return $(this.element.nativeElement).fullCalendar(args[0], args[1]);
            case 3:
                return $(this.element.nativeElement).fullCalendar(args[0], args[1], args[2]);
        }
    }

    updateEvent(event: any) {
        return $(this.element.nativeElement).fullCalendar('updateEvent', event);
    }

    clientEvents(idOrFilter: any): any {
        return $(this.element.nativeElement).fullCalendar('clientEvents', idOrFilter);
    }

    renderEvents(events: EventObjectInput[]) {
        $(this.element.nativeElement).fullCalendar('removeEvents');
        if (events && events.length > 0) {
            $(this.element.nativeElement).fullCalendar('renderEvents', events, true);
            $(this.element.nativeElement).fullCalendar('rerenderEvents');
        }
    }
}

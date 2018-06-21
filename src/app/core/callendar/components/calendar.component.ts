import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { Default } from 'fullcalendar/View';
import { NgFullCalendarComponent } from '../../../common/ng-fullcalendar/ng-full-calendar.component';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';
import { IcalendarTransformer } from '../transformers/icalendar-transformer';
import { v4 as uuid } from 'uuid';
import { HearingPartModificationService } from '../../../hearing-part/services/hearing-part-modification-service';
import { SessionAssignment } from '../../../hearing-part/models/session-assignment';
import { TransactionDialogComponent } from '../../../sessions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';
import { DialogWithActionsComponent } from '../../../features/notification/components/dialog-with-actions/dialog-with-actions.component';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {

    @ViewChild(NgFullCalendarComponent) public ucCalendar: NgFullCalendarComponent;
    calendarOptions: any;
    errors: string;
    references = [];
    calHeight = 'auto';
    isSelected = false;
    selectedSessionId;
    confirmationDialogOpen;
    confirmationDialogRef;

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

    constructor(public hearingModificationService: HearingPartModificationService, public dialog: MatDialog) {
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        };
        this.views = {};
        this.defaultView = 'agendaDay';
    }

    public refreshViewData() {
        if (this.loadData === undefined) {
            return;
        }

        let dateRange = this.parseDates();
        if (dateRange === undefined) {
            return;
        }

        this.loadData.emit(dateRange);
    }

    ngAfterViewInit() {
        ($('.draggable-hearing') as any).draggable({
            revert: true
        })
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
        if (this.ucCalendar === undefined) {
            return undefined;
        }

        let view = this.ucCalendar.fullCalendar('getView') as Default;
        let endDate = view.intervalEnd.toDate() || new Date('2018-04-29');
        let startDate = view.intervalStart.toDate() || new Date('2018-04-23');

        return {startDate: startDate, endDate: endDate};
    }

    ngOnInit() {
        this.calendarOptions = {
            // schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            height: this.calHeight,
            defaultDate: this.initialStartDate,
            contentHeight: this.calHeight,
            defaultView: this.defaultView,
            minTime: moment.duration('09:00:00'),
            maxTime: moment.duration('17:30:00'),
            editable: true,
            droppable: true,
            eventLimit: false,
            header: this.header,
            views: this.views
        };
        // when there are defined resources, agendaDay view for a simple calendar may not work
        // another approach would be to create separate component for scheduler
        // fix bellow is related to a serios of issues on fullcalendar github,
        if (this.resourceColumns !== undefined) {
            this.calendarOptions.resourceColumns = this.resourceColumns;
            this.calendarOptions.resources = (callback) => {
                callback(this._resources);
            }
        }
    }

    public calendarInitialized() {
        this.refreshViewData();
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
        this.eventClickCallback.emit(event.detail.event.id);
    }

    public eventDrop(event) {
        this.emitWithUpdatedTime(this.eventDropCallback, event);
    }

    public eventResize(event) {
        this.emitWithUpdatedTime(this.eventResizeCallback, event);
    }

    private emitWithUpdatedTime(eventCallback: any, event) {
        event.detail.event.start = moment(event.detail.event.start.format());
        event.detail.event.end = moment(event.detail.event.end.format());

        eventCallback.emit(event);
    }

    public drop(event) {
        if (!this.confirmationDialogOpen) {
            this.confirmationDialogRef = this.openConfirmationDialog();
            this.confirmationDialogRef.afterClosed().subscribe(confirmed => {
                this.confirmationDialogOpen = false;
                if(confirmed) {
                    this.hearingModificationService.assignHearingPartWithSession({
                        hearingPartId: event.detail.ui.helper[0].dataset.hearingid,
                        userTransactionId: uuid(),
                        sessionId: this.selectedSessionId,
                        start: null // this.calculateStartOfHearing(this.selectedSession)
                    } as SessionAssignment);
                    event.detail.ui.helper[0].remove();
                    this.openSummaryDialog();
                }
            });
        }
    }

    public eventMouseOver(event) {
        console.log('OVER')
        this.isSelected = true;
        console.log(this.isSelected)
        this.selectedSessionId = event.detail.event.id;
    }

    public eventMouseOut(event) {
        console.log('OUT')
        this.isSelected = false;
    }

    private openSummaryDialog() {
        this.dialog.open(TransactionDialogComponent, {
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true
        });
    }

    private openConfirmationDialog() {
        this.confirmationDialogOpen = true;

        return this.dialog.open(DialogWithActionsComponent, {
            width: 'auto',
            minWidth: 350,
            data: {
                message: 'Are you sure you want to modify this session?'
            },
            hasBackdrop: true
        });
    }
}

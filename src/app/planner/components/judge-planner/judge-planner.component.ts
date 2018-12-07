import { MatDialog, MatDialogRef } from '@angular/material';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionViewModel, SessionCalendarViewModel } from '../../../sessions/models/session.viewmodel';
import { IcalendarTransformer } from '../../../core/callendar/transformers/icalendar-transformer';
import * as judgeReducers from '../../../judges/reducers';
import { select, Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { ResourceList } from '../../../core/callendar/model/resource-list';
import { Judge } from '../../../judges/models/judge.model';
import { DataWithSimpleResourceTransformer } from '../../../core/callendar/transformers/data-with-simple-resource-transformer';
import * as judgeActions from '../../../judges/actions/judge.action';
import { Separator } from '../../../core/callendar/transformers/data-with-simple-resource-transformer';
import { CalendarEventSessionViewModel } from '../../types/calendar-event-session-view-model.type';
import { DialogInfoComponent } from '../../../features/notification/components/dialog-info/dialog-info.component';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';
import { EventDrop } from '../../../common/ng-fullcalendar/models/event-drop.model';
import { CalendarMouseEvent } from '../../../common/ng-fullcalendar/models/calendar-mouse-event.model';

@Component({
    selector: 'app-judge-planner',
    templateUrl: './judge-planner.component.html'
})
export class JudgePlannerComponent implements OnInit {
    header: any;
    views: any;
    columns: any[];
    resources: any[];
    dataTransformer: IcalendarTransformer<SessionViewModel, SessionCalendarViewModel>;
    defaultView: string;
    @Output() loadDataAction = new EventEmitter();
    @Output() eventClick = new EventEmitter<CalendarEventSessionViewModel>();
    @Output() eventResize = new EventEmitter<CalendarEventSessionViewModel>();
    @Output() eventDrop = new EventEmitter<CalendarEventSessionViewModel>();
    @Output() drop = new EventEmitter<CustomEvent<EventDrop>>();
    @Output() eventMouseOver = new EventEmitter<CustomEvent<CalendarMouseEvent>>();
    @Input() initialStartDate: Date;
    @Input() sessions: SessionViewModel[];

    constructor(private readonly store: Store<State>, private readonly dialog: MatDialog) {
        this.defaultView = 'timelineWeek';
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'timelineDay,timelineWeek,timelineMonth'
        };
        this.views = {
            timelineDay: {
                slotDuration: '00:10'
            },
            timelineWeek: {
                slotDuration: '00:30'
            }
        };
    }

    ngOnInit() {
        this.configureJudgeView();
        this.store.dispatch(new judgeActions.Get());
    }

    public configureJudgeView() {
        this.dataTransformer = new DataWithSimpleResourceTransformer('person');
        this.columns = [
            {
                labelText: 'Judge',
                field: 'title'
            }
        ];
        this.store.pipe(select(judgeReducers.getJudges)).subscribe(elements => {
            let newResourceList = new ResourceList('person'); // NOSONAR not const
            Object.values(elements).forEach((judge: Judge) => {
                newResourceList.add(`person${Separator}${judge.id}`, judge.name);
            });
            this.resources = newResourceList.get();
        });
    }

    childLoadDataAction(event) {
        this.loadDataAction.emit(event);
    }

    childEventClick(event: CalendarEventSessionViewModel) {
        this.eventClick.emit(event);
    }

    childEventResize(event: CalendarEventSessionViewModel) {
        this.eventResize.emit(event);
    }

    childEventDrop(event: CalendarEventSessionViewModel) {
        if (this.verifyActionCanBeMade(event)) {
            this.eventDrop.emit(event);
        }
    }

    childEventMouseOver(event: CustomEvent<CalendarMouseEvent>) {
        this.eventMouseOver.emit(event);
    }

    childDrop(event: CustomEvent<EventDrop>) {
        this.drop.emit(event);
    }

    private verifyActionCanBeMade(event: CalendarEventSessionViewModel): boolean {
        const hasMultiHearingPart = event.detail.event.hearingParts.filter(hp => hp.multiSession).length > 0
        const sourcePersonId = event.detail.event.person.id
        const targetPersonId = event.detail.event.resourceId.split(Separator).pop()

        if (hasMultiHearingPart && sourcePersonId !== targetPersonId) {
            this.openWarningMultiSessionDialog().afterClosed().subscribe(() => {
                event.detail.revertFunc()
            })
            return false;
        }

        return true;
    }

    private openWarningMultiSessionDialog(): MatDialogRef<DialogInfoComponent> {
        return this.dialog.open(DialogInfoComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: 'This session cannot be assigned to a different judge ' +
            'as it includes a multi-session hearing which needs the same judge throughout'
        });
    }
}

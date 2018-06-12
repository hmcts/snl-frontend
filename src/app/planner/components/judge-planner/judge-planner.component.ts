import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { IcalendarTransformer } from '../../../core/callendar/transformers/icalendar-transformer';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as fromReducer from '../../../sessions/reducers';
import * as fromSessions from '../../../sessions/reducers';
import * as judgeReducers from '../../../judges/reducers';
import * as fromRoomActions from '../../../rooms/actions/room.action';
import { Observable } from 'rxjs/Observable';
import { CallendarComponent } from '../../../core/callendar/components/callendar.component';
import { select, Store } from '@ngrx/store';
import { State } from '../../../app.state';
import { Subscription } from 'rxjs/Subscription';
import { DetailsDialogComponent } from '../../../sessions/components/details-dialog/details-dialog.component';
import { SearchForDates } from '../../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../../sessions/models/session-query.model';
import { SessionDialogDetails } from '../../../sessions/models/session-dialog-details.model';
import { ResourceList } from '../../../core/callendar/model/resource-list';
import { Judge } from '../../../judges/models/judge.model';
import { DataWithSimpleResourceTransformer } from '../../../core/callendar/transformers/data-with-simple-resource-transformer';
import * as judgeActions from '../../../judges/actions/judge.action';

@Component({
  selector: 'app-judge-planner',
  templateUrl: './judge-planner.component.html'
})
export class JudgePlannerComponent implements OnInit {

    header: any;
    views: any;
    columns: any[];
    resources: any[];
    dataTransformer: IcalendarTransformer<SessionViewModel>;
    sessions$: Observable<any[]>;
    defaultView: string;
    @Output() loadDataAction = new EventEmitter();
    @Output() eventClick = new EventEmitter();
    @Input() initialStartDate: Date;

    constructor(private store: Store<State>) {
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
        this.sessions$ = this.store.select(fromReducer.getFullSessions);
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
            let newResourceList = new ResourceList();
            Object.values(elements).forEach((judge: Judge) => {
                newResourceList.add('person-' + judge.id, judge.name);
            });
            this.resources = newResourceList.get();
        });
    }

    childLoadDataAction(event) {
        this.loadDataAction.emit(event)
    }

    childEventClick(event) {
        this.eventClick.emit(event)
    }

}
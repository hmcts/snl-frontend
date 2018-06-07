import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromReducer from '../../sessions/reducers/index';
import { SearchForDates, } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { ActivatedRoute } from '@angular/router';
import { DetailsDialogComponent } from '../../sessions/components/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionDialogDetails } from '../../sessions/models/session-dialog-details.model';
import { Room } from '../../rooms/models/room.model';
import * as fromSessions from '../../sessions/reducers';
import * as judgeReducers from '../../judges/reducers';
import * as fromRoomActions from '../../rooms/actions/room.action';
import { ResourceList } from '../../core/callendar/model/resource-list';
import { IcalendarTransformer } from '../../core/callendar/transformers/icalendar-transformer';
import { DataWithSimpleResourceTransformer } from '../../core/callendar/transformers/data-with-simple-resource-transformer';
import { SessionViewModel } from '../../sessions/models/session.viewmodel';
import { Judge } from '../../judges/models/judge.model';
import * as judgeActions from '../../judges/actions/judge.action';
import { Subscription } from 'rxjs/Subscription';
import { CallendarComponent } from '../../core/callendar/components/callendar.component';

@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html',
    styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {

    header: any;
    views: any;
    columns: any[];
    resources: any[];
    dataTransformer: IcalendarTransformer<SessionViewModel>;
    loadDataAction: (SessionQueryForDates) => void;
    sessions$: Observable<any[]>;
    defaultView: string;
    @ViewChild(CallendarComponent) private _slCalendar: CallendarComponent;

    private roomsSubscription: Subscription = Subscription.EMPTY;
    private judgesSubscription: Subscription = Subscription.EMPTY;

    constructor(private store: Store<State>, private route: ActivatedRoute,
                public dialog: MatDialog) {
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
        this.sessions$ = this.store.select(fromReducer.getFullSessions);
        this.route.data.subscribe((data) => {
            this.loadDataAction = this.loadDataForAllJudges;
        });
        this.configureRoomView();
    }

    public configureRoomView() {
        this.judgesSubscription.unsubscribe();
        this.dataTransformer = new DataWithSimpleResourceTransformer('room');
        this.columns = [
            {
                labelText: 'Room',
                field: 'title'
            }
        ];
        this.roomsSubscription = this.store.pipe(select(fromSessions.getRooms)).subscribe(elements => {
            let newResourceList = new ResourceList();
            Object.values(elements).forEach((room: Room) => {
                newResourceList.add('room-' + room.id, room.name);
            });
            this.resources = newResourceList.get();
        });
        this.store.dispatch(new fromRoomActions.Get());
        this._slCalendar.refreshViewData();
    }

    public configureJudgeView() {
        this.roomsSubscription.unsubscribe();
        this.dataTransformer = new DataWithSimpleResourceTransformer('person');
        this.columns = [
            {
                // TODO figure out why this does not expand and as such gives issues
                labelText: 'Judge',
                field: 'title'
            }
        ];
        this.judgesSubscription = this.store.pipe(select(judgeReducers.getJudges)).subscribe(elements => {
            let newResourceList = new ResourceList();
            Object.values(elements).forEach((judge: Judge) => {
                newResourceList.add('person-' + judge.id, judge.name);
            });
            this.resources = newResourceList.get();
        });
        this.store.dispatch(new judgeActions.Get());
        this._slCalendar.refreshViewData();
    }

    private loadDataForAllJudges(query: SessionQueryForDates) {
        this.store.dispatch(new SearchForDates(query));
    }

    public eventClick(session) {
        console.log(session);
        this.dialog.open(DetailsDialogComponent, {
            width: 'auto',
            minWidth: 350,
            data: new SessionDialogDetails(session),
            hasBackdrop: false
        });
    }
}

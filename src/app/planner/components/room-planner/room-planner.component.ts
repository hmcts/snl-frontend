import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Room } from '../../../rooms/models/room.model';
import * as fromReducer from '../../../sessions/reducers';
import * as fromSessions from '../../../sessions/reducers';
import * as fromRoomActions from '../../../rooms/actions/room.action';
import { ResourceList } from '../../../core/callendar/model/resource-list';
import { select, Store } from '@ngrx/store';
import { DataWithSimpleResourceTransformer } from '../../../core/callendar/transformers/data-with-simple-resource-transformer';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { IcalendarTransformer } from '../../../core/callendar/transformers/icalendar-transformer';
import { Observable } from 'rxjs/Observable';
import { State } from '../../../app.state';

@Component({
    selector: 'app-room-planner',
    templateUrl: './room-planner.component.html'
})
export class RoomPlannerComponent implements OnInit {

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
        this.configureRoomView();
        this.sessions$ = this.store.select(fromReducer.getFullSessions);
        this.store.dispatch(new fromRoomActions.Get());
    }

    public configureRoomView() {
        this.dataTransformer = new DataWithSimpleResourceTransformer('room');
        this.columns = [
            {
                labelText: 'Room',
                field: 'title'
            }
        ];
        this.store.pipe(select(fromSessions.getRooms)).subscribe(elements => {
            let newResourceList = new ResourceList();
            Object.values(elements).forEach((room: Room) => {
                newResourceList.add('room-' + room.id, room.name);
            });
            this.resources = newResourceList.get();
        });
    }

    childLoadDataAction(event) {
        this.loadDataAction.emit(event);
    }

    childEventClick(event) {
        this.eventClick.emit(event);
    }
}

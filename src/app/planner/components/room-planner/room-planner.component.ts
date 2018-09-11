import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Room } from '../../../rooms/models/room.model';
import * as fromSessions from '../../../sessions/reducers';
import * as fromRoomActions from '../../../rooms/actions/room.action';
import { ResourceList } from '../../../core/callendar/model/resource-list';
import { select, Store } from '@ngrx/store';
import { DataWithSimpleResourceTransformer } from '../../../core/callendar/transformers/data-with-simple-resource-transformer';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { IcalendarTransformer } from '../../../core/callendar/transformers/icalendar-transformer';
import { State } from '../../../app.state';
import { Separator } from '../../../core/callendar/transformers/data-with-simple-resource-transformer';

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
    defaultView: string;
    @Output() loadDataAction = new EventEmitter();
    @Output() eventClick = new EventEmitter();
    @Output() eventResize = new EventEmitter();
    @Output() eventDrop = new EventEmitter();
    @Output() drop = new EventEmitter();
    @Output() eventMouseOver = new EventEmitter();
    @Input() initialStartDate: Date;
    @Input() sessions: SessionViewModel[];

    constructor(private readonly store: Store<State>) {
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
            let newResourceList = new ResourceList('room'); // NOSONAR not const
            Object.values(elements).forEach((room: Room) => {
                newResourceList.add(`room${Separator}${room.id}`, room.name);
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

    childEventResize(event) {
        this.eventResize.emit(event);
    }

    childEventDrop(event) {
        this.eventDrop.emit(event);
    }

    childEventMouseOver(event) {
        this.eventMouseOver.emit(event);
    }

    childDrop(event) {
        this.drop.emit(event);
    }
}

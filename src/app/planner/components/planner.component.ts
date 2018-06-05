import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.state';
import { Observable } from 'rxjs/Observable';
import * as fromReducer from '../../sessions/reducers/index';
import { SearchForDates, SearchForJudgeWithHearings, } from '../../sessions/actions/session.action';
import { SessionQueryForDates } from '../../sessions/models/session-query.model';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from '../../security/services/security.service';
import { DiaryLoadParameters } from '../../sessions/models/diary-load-parameters.model';
import { DetailsDialogComponent } from '../../sessions/components/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material';
import { SessionDialogDetails } from '../../sessions/models/session-dialog-details.model';
import { Room } from '../../rooms/models/room.model';
import * as fromSessions from '../../sessions/reducers';
import * as fromRoomActions from '../../rooms/actions/room.action';
import { ResourceList } from '../../core/callendar/model/resource-list';
import { IcalendarTransformer } from '../../core/callendar/transformers/icalendar-transformer';
import { DataWithSimpleResourceTransformer } from '../../core/callendar/transformers/data-with-simple-resource-transformer';
import { SessionViewModel } from '../../sessions/models/session.viewmodel';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent  implements OnInit {

    header: any;
    views: any;
    columns: any[];
    resources: any[];
    dataTransformer: IcalendarTransformer<SessionViewModel>;
    loadData;
    sessions$: Observable<any[]>;

    constructor(private store: Store<State>, private route: ActivatedRoute,
                public dialog: MatDialog) {
        this.sessions$ = this.store.select(fromReducer.getFullSessions);
    }

    ngOnInit() {
        // configure
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
                newResourceList.add(room.id, room.name);
            });
            this.resources = newResourceList.get();
        });
        this.header = {
            center: 'month,timelineFourDays'
        };
        this.views = {
            timelineFourDays: {
                type: 'timeline',
                    duration: {days: 4}
            }
        };

        // ask for data
        this.store.dispatch(new fromRoomActions.Get());
        this.route.data.subscribe((data) => {
            this.loadData = this.loadDataForAllJudges;
        });
    }

    private loadDataForAllJudges(query: SessionQueryForDates) {
        this.store.dispatch(new SearchForDates(query));
    }

    public eventClick(session) {
        this.dialog.open(DetailsDialogComponent, {
            width: 'auto',
            minWidth: 350,
            data: new SessionDialogDetails(session),
            hasBackdrop: false
        });
    }
}

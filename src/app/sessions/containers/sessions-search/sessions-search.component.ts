import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SearchForDates } from '../../actions/session.action';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as fromSessions from '../../reducers';
import * as fromJudges from '../../../judges/reducers';
import * as fromReferenceData from '../../../core/reference/reducers';
import * as moment from 'moment';
import { SessionViewModel } from '../../models/session.viewmodel';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';
import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import { SessionFilters } from '../../models/session-filter.model';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { asArray } from '../../../utils/array-utils';
import { HearingPartViewModel } from '../../../hearing-part/models/hearing-part.viewmodel';
import { SessionType } from '../../../core/reference/models/session-type';
import { SessionsFilterService } from '../../services/sessions-filter-service';
import { SessionAmendDialogComponent } from '../../components/session-amend-dialog/session-amend-dialog';
import { SessionAmmendDialogData } from '../../models/ammend/session-amend-dialog-data.model';
import { RoomType } from '../../../core/reference/models/room-type';
import * as Mapper from '../../mappers/amend-session-form-session-amend';
import { SessionAmmendForm } from '../../models/ammend/session-ammend-form.model';

@Component({
    selector: 'app-sessions-search',
    templateUrl: './sessions-search.component.html',
    styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    startDate: moment.Moment;
    endDate: moment.Moment;
    hearingParts$: Observable<HearingPartViewModel[]>;
    sessions$: Observable<SessionViewModel[]>;
    rooms: Room[];
    roomTypes: RoomType[];
    judges: Judge[];
    filters$ = new Subject<SessionFilters>();
    sessionTypes: SessionType[];
    filteredSessions: SessionViewModel[];

    constructor(private readonly store: Store<fromHearingParts.State>,
                private readonly sessionsFilterService: SessionsFilterService,
                public dialog: MatDialog) {
        this.hearingParts$ = this.store.pipe(
            select(fromHearingParts.getFullHearingParts),
            map(asArray),
            map(sessionsFilterService.filterUnlistedHearingParts)
        ) as Observable<HearingPartViewModel[]>;

        this.store.pipe(select(fromSessions.getRooms), map(asArray)).subscribe(rooms => { this.rooms = rooms as Room[]});
        this.store.pipe(select(fromJudges.getJudges), map(asArray)).subscribe(judges => { this.judges = judges as Judge[]});
        this.store.pipe(select(fromReferenceData.selectSessionTypes)).subscribe(sessionTypes => {
            this.sessionTypes = sessionTypes;
        });
        this.store.pipe(select(fromReferenceData.selectRoomTypes)).subscribe(roomTypes => {
            this.roomTypes = roomTypes;
        });
        this.sessions$ = this.store.pipe(select(fromSessions.getFullSessions));
        this.startDate = moment();
        this.endDate = moment().add(5, 'years');

        combineLatest(this.sessions$, this.filters$, this.filterSessions).subscribe((data) => { this.filteredSessions = data});
    }

    ngOnInit() {
        this.store.dispatch(new SearchForDates({startDate: this.startDate, endDate: this.endDate}));
        this.store.dispatch(new fromHearingPartsActions.Search({ isListed: false }));
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
    }

    openAmendDialog(s: SessionViewModel) {
        let sessionAmendForm: SessionAmmendForm = Mapper.SessionToAmendSessionForm(s, this.roomTypes);
        this.dialog.open<any, SessionAmmendDialogData>(SessionAmendDialogComponent, {
            data: {
                sessionData: sessionAmendForm,
                sessionTypes: this.sessionTypes,
                notes: s.notes
            },
            hasBackdrop: true,
            height: 'auto',
            disableClose: true
        })
    }

    filterSessions = (sessions: SessionViewModel[], filters: SessionFilters): SessionViewModel[] => {
        if (!filters) {
            return sessions;
        }
        if (filters.startDate !== this.startDate) {
            this.store.dispatch(new SearchForDates({startDate: filters.startDate, endDate: filters.endDate}));
            this.startDate = filters.startDate;
            this.endDate = filters.endDate;
        }

        return sessions.filter(s => this.sessionsFilterService.filterByProperty(s.person, filters.judges))
            .filter(s => this.sessionsFilterService.filterByProperty(s.room, filters.rooms))
            .filter(s => this.sessionsFilterService.filterBySessionType(s, filters))
            .filter(s => this.sessionsFilterService.filterByUtilization(s, filters.utilization));
    }

}

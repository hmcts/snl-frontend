import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers';
// import * as fromSessions from '../../reducers';
import * as fromJudges from '../../../judges/reducers';
import * as fromReferenceData from '../../../core/reference/reducers';
// import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
// import { SessionViewModel } from '../../models/session.viewmodel';
// import * as RoomActions from '../../../rooms/actions/room.action';
import * as JudgeActions from '../../../judges/actions/judge.action';
import * as fromHearingPartsActions from '../../../hearing-part/actions/hearing-part.action';
// import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subject } from 'rxjs/Subject';
// import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';
// import { SessionAssignment } from '../../../hearing-part/models/session-assignment';
import { HearingPartModificationService } from '../../../hearing-part/services/hearing-part-modification-service';
import { asArray } from '../../../utils/array-utils';
import { HearingPartViewModel } from '../../../hearing-part/models/hearing-part.viewmodel';
// import { SessionType } from '../../../core/reference/models/session-type';
import { HearingsFilterService } from '../../services/hearings-filter-service';
// import { safe } from '../../../utils/js-extensions';
import { NotesListDialogComponent } from '../../../notes/components/notes-list-dialog/notes-list-dialog.component';
import { enableDisplayCreationDetails, getNoteViewModel } from '../../../notes/models/note.viewmodel';
// import { SearchForDates } from '../../../sessions/actions/session.action';
import { HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';

@Component({
    selector: 'app-hearings-search',
    templateUrl: './hearings-search.component.html',
    styleUrls: ['./hearings-search.component.scss']
})
export class HearingsSearchComponent implements OnInit {

    startDate: moment.Moment;
    endDate: moment.Moment;
    hearingParts$: Observable<HearingPartViewModel[]>;
    // sessions$: Observable<SessionViewModel[]>;
    // rooms$: Observable<Room[]>;
    judges$: Observable<Judge[]>;
    // selectedSession: SessionViewModel;
    // selectedHearingPart: HearingPartViewModel;
    filters$ = new Subject<HearingsFilters>();
    // sessionTypes$: Observable<SessionType[]>;
    caseTypes$: Observable<CaseType[]>;
    hearingTypes$: Observable<HearingType[]>;
    filteredHearings: HearingPartViewModel[];

    constructor(private readonly store: Store<fromHearingParts.State>,
                private readonly hearingsFilterService: HearingsFilterService,
                public hearingModificationService: HearingPartModificationService,
                public dialog: MatDialog) {
        this.hearingParts$ = this.store.pipe(
          select(fromHearingParts.getFullHearingParts)
            // map(asArray),
            // map(this.hearingsFilterService.filterUnlistedHearingParts)
          ) as Observable<HearingPartViewModel[]>;

        // this.rooms$ = this.store.pipe(select(fromSessions.getRooms), map(asArray)) as Observable<Room[]>;
        this.judges$ = this.store.pipe(select(fromJudges.getJudges), map(asArray)) as Observable<Judge[]>;
        this.caseTypes$ = this.store.pipe(select(fromReferenceData.selectCaseTypes));
        this.hearingTypes$ = this.store.pipe(select(fromReferenceData.selectHearingTypes));

        // this.sessions$ = this.store.pipe(select(fromSessions.getFullSessions));
        this.startDate = moment();
        this.endDate = moment().add(5, 'years');

        //
    }

    ngOnInit() {
        // TODO SL-1551: Trzeba by te 3 endpointy recznie tu wywolywac
        // this.store.dispatch(new SearchForDates({startDate: this.startDate, endDate: this.endDate}));
        // this.store.dispatch(new fromHearingPartsActions.Search({ isListed: false }));
        // this.store.dispatch(new fromHearingPartsActions.Search({ isListed: true }));
        // this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());
        this.store.dispatch(new fromHearingPartsActions.Clear());
    }

    filter(filterValues: HearingsFilters) {
        combineLatest(this.hearingParts$, this.filters$, this.filterHearings).subscribe((data) => { this.filteredHearings = data});
        this.filters$.next(filterValues);
    }

    filterHearings = (hearings: HearingPartViewModel[], filters: HearingsFilters): HearingPartViewModel[] => {
        if (!filters) {
            return hearings;
        }
        if (filters.startDate !== this.startDate) {
            // TODO SL-1515 change bellow for a regular call
            // this.store.dispatch(new SearchForDates({startDate: filters.startDate, endDate: filters.endDate}));
            this.store.dispatch(new fromHearingPartsActions.Search());
            this.startDate = filters.startDate;
            this.endDate = filters.endDate;
        }

        return hearings.filter(h => this.hearingsFilterService.filterByProperty(h.reservedJudge, filters.judges))
            .filter(h => this.hearingsFilterService.filterByCaseType(h, filters))
            .filter(h => this.hearingsFilterService.filterByHearingType(h, filters));
    }

    openNotesDialog(hearing: HearingPartViewModel) {
        this.dialog.open(NotesListDialogComponent, {
            data: hearing.notes.map(getNoteViewModel).map(enableDisplayCreationDetails),
            hasBackdrop: false,
            width: '30%'
        })
    }

}

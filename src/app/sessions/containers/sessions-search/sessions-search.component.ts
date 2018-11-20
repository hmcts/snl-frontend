import { SessionsFilterComponent } from './../../components/sessions-filter/sessions-filter.component';
import { SearchCriteria } from './../../../hearing-part/models/search-criteria';
import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import 'rxjs/add/observable/of';
import * as fromHearingParts from '../../../hearing-part/reducers';
import * as fromSessions from '../../reducers';
import * as fromJudges from '../../../judges/reducers';
import * as fromReferenceData from '../../../core/reference/reducers';
import * as moment from 'moment';
import * as RoomActions from '../../../rooms/actions/room.action';
import * as JudgeActions from '../../../judges/actions/judge.action';
import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import { SessionFilters } from '../../models/session-filter.model';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { asArray } from '../../../utils/array-utils';
import { SessionType } from '../../../core/reference/models/session-type';
import { SessionAmendDialogComponent } from '../../components/session-amend-dialog/session-amend-dialog';
import { SessionAmmendDialogData } from '../../models/ammend/session-amend-dialog-data.model';
import * as Mapper from '../../mappers/amend-session-form-session-amend';
import { SessionAmmendForm } from '../../models/ammend/session-ammend-form.model';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';
import { SessionsService } from '../../services/sessions-service';
import { TableSetting } from '../../models/table-settings.model';
import { SessionAmendmentTableComponent } from '../../components/session-amendment-table/session-amendment-table.component';
import { SessionSearchCriteriaService } from '../../services/session-search-criteria.service';
import { SessionSearchResponse } from '../../models/session-search-response.model';

@Component({
    selector: 'app-sessions-search',
    templateUrl: './sessions-search.component.html',
    styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {
    startDate: moment.Moment;
    endDate: moment.Moment;
    rooms: Room[];
    judges: Judge[];
    sessionTypes: SessionType[];
    filteredSessions: SessionSearchResponse[];
    totalCount: number;

    @ViewChild(SessionsFilterComponent) sessionFilterComponent: SessionsFilterComponent;
    @ViewChild(SessionAmendmentTableComponent) sessionAmendmentTableComponent: SessionAmendmentTableComponent;

    constructor(private readonly store: Store<fromHearingParts.State>,
                private readonly sessionService: SessionsService,
                private readonly sessionSearchCriteriaService: SessionSearchCriteriaService,
                public dialog: MatDialog) {
        this.store.pipe(select(fromSessions.getRooms), map(asArray)).subscribe(rooms => { this.rooms = rooms as Room[]});
        this.store.pipe(select(fromJudges.getJudges), map(asArray)).subscribe(judges => { this.judges = judges as Judge[]});
        this.store.pipe(select(fromReferenceData.selectSessionTypes)).subscribe(sessionTypes => this.sessionTypes = sessionTypes);
    }

    ngOnInit() {
        this.store.dispatch(new RoomActions.Get());
        this.store.dispatch(new JudgeActions.Get());

        this.sessionFilterComponent.sessionFilter$.combineLatest(
            this.sessionAmendmentTableComponent.tableSettings$, (filters: SessionFilters, tableSetting: TableSetting) => {
                if (filters && tableSetting) {
                    const searchCriterions: SearchCriteria[] = this.sessionSearchCriteriaService.convertToSearchCriterions(filters);
                    this.searchSessions(searchCriterions, tableSetting);
                }

            }
        ).subscribe()
    }

    openAmendDialog(s: SessionSearchResponse) {
        let sessionAmendForm: SessionAmmendForm = Mapper.SessionToAmendSessionForm(s);
        this.dialog.open<any, SessionAmmendDialogData>(SessionAmendDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: {
                sessionData: sessionAmendForm,
                sessionTypes: this.sessionTypes,
                notes: s.notes
            },
            height: 'auto'
        })
    }

    searchSessions(searchCriterion: SearchCriteria[], tableSettings: TableSetting) {
        this.sessionService.paginatedSearchSessions(searchCriterion, tableSettings)
            .subscribe(sessions => {
                this.filteredSessions = sessions.content || [];
                this.totalCount = sessions.totalElements
            });
    }
}

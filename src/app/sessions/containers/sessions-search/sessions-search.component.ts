import { SessionsFilterComponent } from './../../components/sessions-filter/sessions-filter.component';
import { SearchCriteria } from './../../../hearing-part/models/search-criteria';
import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/observable/of';
import * as moment from 'moment';
import { Room } from '../../../rooms/models/room.model';
import { Judge } from '../../../judges/models/judge.model';
import { SessionFilters } from '../../models/session-filter.model';
import { MatDialog } from '@angular/material';
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
import { NotesService } from '../../../notes/services/notes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-sessions-search',
    templateUrl: './sessions-search.component.html',
    styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {
    startDate: moment.Moment = moment().startOf('day')
    endDate: moment.Moment = moment().add(3, 'month').endOf('day');
    rooms: Room[];
    judges: Judge[];
    sessionTypes: SessionType[];
    filteredSessions: SessionSearchResponse[];
    totalCount: number;
    savedSearchCriterion: SearchCriteria[];
    savedTableSettings: TableSetting;
    savedSessionFilters: SessionFilters;

    @ViewChild(SessionsFilterComponent) sessionFilterComponent: SessionsFilterComponent;
    @ViewChild(SessionAmendmentTableComponent) sessionAmendmentTableComponent: SessionAmendmentTableComponent;

    constructor(private route: ActivatedRoute,
                private readonly sessionService: SessionsService,
                private readonly sessionSearchCriteriaService: SessionSearchCriteriaService,
                private readonly notesService: NotesService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.route.data.subscribe(({judges, rooms, sessionTypes}) => {
            this.judges = judges;
            this.rooms = rooms;
            this.sessionTypes = sessionTypes;
        });

        this.sessionFilterComponent.sessionFilter$.combineLatest(
            this.sessionAmendmentTableComponent.tableSettings$, (filters: SessionFilters, tableSetting: TableSetting) => {
                if (filters && tableSetting) {
                    if (JSON.stringify(this.savedSessionFilters) !== JSON.stringify(filters)) {
                        this.sessionAmendmentTableComponent.resetToFirstPage();
                    }

                    const searchCriterions: SearchCriteria[] = this.sessionSearchCriteriaService.convertToSearchCriterions(filters);
                    this.searchSessions(searchCriterions, tableSetting);
                    // create a deep copy
                    this.savedSessionFilters = JSON.parse(JSON.stringify(filters));
                }
            }
        ).subscribe()
    }

    openAmendDialog(s: SessionSearchResponse) {
        const sessionNotes$ = this.notesService.getByEntities([s.sessionId]);
        const sessionAmend$ = this.sessionService.getSessionAmendById(s.sessionId);

        sessionNotes$.combineLatest(sessionAmend$, (notes, session) => {
            const sessionAmendForm: SessionAmmendForm = Mapper.SessionToAmendSessionForm(session);
            this.dialog.open<any, SessionAmmendDialogData>(SessionAmendDialogComponent, {
                ...DEFAULT_DIALOG_CONFIG,
                data: {
                    sessionData: sessionAmendForm,
                    sessionTypes: this.sessionTypes,
                    notes: notes
                },
                height: 'auto'
            }).afterClosed().subscribe(() => {
                this.searchSessions(this.savedSearchCriterion, this.savedTableSettings)
            });
        }).subscribe();
    }

    searchSessions(searchCriterion: SearchCriteria[], tableSettings: TableSetting) {
        this.savedSearchCriterion = searchCriterion;
        this.savedTableSettings = tableSettings;

        this.sessionService.paginatedSearchSessions(searchCriterion, tableSettings)
            .subscribe(sessions => {
                this.filteredSessions = sessions.content || [];
                this.totalCount = sessions.totalElements
            });
    }
}

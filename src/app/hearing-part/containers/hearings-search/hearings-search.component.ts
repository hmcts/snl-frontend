import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Judge } from '../../../judges/models/judge.model';
import { HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { SearchHearingRequest } from '../../models/search-hearing-request';
import { HearingPartService } from '../../services/hearing-part-service';
import { MatDialog, PageEvent } from '@angular/material';
import { ReferenceDataService } from '../../../core/reference/services/reference-data.service';
import { JudgeService } from '../../../judges/services/judge.service';
import { FilteredHearingViewmodel } from '../../models/filtered-hearing-viewmodel';
import { DialogWithActionsComponent } from '../../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { HearingModificationService } from '../../services/hearing-modification.service';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';

@Component({
    selector: 'app-hearings-search',
    templateUrl: './hearings-search.component.html',
    styleUrls: ['./hearings-search.component.scss']
})
export class HearingsSearchComponent implements OnInit {

    public static DEFAULT_PAGING: PageEvent = {
        pageSize: 10,
        pageIndex: 0,
        length: undefined
    };

    judges$: Observable<Judge[]>;
    caseTypes$: Observable<CaseType[]>;
    hearingTypes$: Observable<HearingType[]>;

    filteredHearings: FilteredHearingViewmodel[] = [];
    latestFilters: HearingsFilters;
    latestPaging = HearingsSearchComponent.DEFAULT_PAGING;
    totalCount: number;

    constructor(private dialog: MatDialog,
                private hearingService: HearingModificationService,
                private hearingPartService: HearingPartService,
                private referenceDataService: ReferenceDataService,
                private judgeService: JudgeService,
                private searchCriteriaService: SearchCriteriaService) {
    }

    ngOnInit() {
        this.judges$ = this.judgeService.get();
        this.caseTypes$ = this.referenceDataService.getCaseTypes();
        this.hearingTypes$ = this.referenceDataService.getHearingTypes();
    }

    onDelete(hearing: FilteredHearingViewmodel) {
        this.openDeleteDialog(hearing);
    }

    onNextPage(pageEvent: PageEvent) {
        this.latestPaging = pageEvent;
        this.fetchHearings(this.latestFilters, pageEvent);
    }

    onFilter(filterValues: HearingsFilters) {
        this.latestFilters = filterValues;
        this.fetchHearings(filterValues, this.latestPaging)
    }

    private openDeleteDialog(hearing: FilteredHearingViewmodel) {
        this.dialog.open(DialogWithActionsComponent, {
            data: { message: `Do you want to remove the listing request for case number ${hearing.caseNumber} ?`}
        }).afterClosed().subscribe((confirmed) => {
            this.afterDeleteClosed(confirmed, hearing)
        })
    }

    private afterDeleteClosed(confirmed, hearing) {
        if (confirmed) {
            this.hearingService.deleteHearing({
                hearingId: hearing.id,
                hearingVersion: hearing.version,
                userTransactionId: undefined
            });

            this.openTransactionDialog().afterClosed().subscribe((success) => {
                this.fetchHearings(this.latestFilters, this.latestPaging);

                if (success) {
                    this.hearingService.removeFromState(hearing.id);
                }
            })
        }
    }

    private openTransactionDialog() {
        return this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
                ...DEFAULT_DIALOG_CONFIG,
            data: { actionTitle: 'Deleting hearing' }
        });
    }

    private fetchHearings(filterValues: HearingsFilters, pageEvent: PageEvent) {
        this.hearingPartService.seearchFilteredHearingViewmodels(this.toSearchHearingRequest(filterValues, pageEvent))
            .subscribe(hearings => {
                this.filteredHearings = hearings.content || [];
                this.totalCount = hearings.totalElements;
            })
    }

    private toSearchHearingRequest(filters: HearingsFilters, pageEvent: PageEvent): SearchHearingRequest {
        return {
            httpParams: {
                size: pageEvent.pageSize,
                page: pageEvent.pageIndex,
            },
            searchCriteria: this.searchCriteriaService.toSearchCriteria(filters)
        }
    }
}

import { Component, Inject, OnInit } from '@angular/core';
import 'rxjs/add/observable/of';
import { Judge } from '../../../judges/models/judge.model';
import { DEFAULT_HEARING_FILTERS, HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { SearchHearingRequest } from '../../models/search-hearing-request';
import { MatDialog, PageEvent } from '@angular/material';
import {
    FilteredHearingViewmodel,
    HearingSearchResponseForAmendment,
} from '../../models/filtered-hearing-viewmodel';
import { NotesService } from '../../../notes/services/notes.service';
import { HearingModificationService } from '../../services/hearing-modification.service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { HearingService } from '../../../hearing/services/hearing.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';
import { DialogWithActionsComponent } from '../../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { ActivatedRoute } from '@angular/router';
import { Note } from '../../../notes/models/note.model';
import { Observable } from 'rxjs/Observable';
import { HearingAmendDialogComponent, HearingAmendDialogData } from '../../components/hearing-amend-dialog/hearing-amend-dialog.component';
import { IStorage } from '../../../core/services/i-storage.interface';

@Component({
    selector: 'app-hearings-search',
    templateUrl: './hearings-search.component.html',
    styleUrls: ['./hearings-search.component.scss']
})
export class HearingsSearchComponent implements OnInit {

    public static STORAGE_KEY = 'hearingsSearchComponent';

    public static DEFAULT_PAGING: PageEvent = {
        pageSize: 10,
        pageIndex: 0,
        length: undefined
    };

    judges: Judge[];
    caseTypes: CaseType[];
    hearingTypes: HearingType[];

    filteredHearings: FilteredHearingViewmodel[] = [];
    latestFilters: HearingsFilters = DEFAULT_HEARING_FILTERS;
    latestPaging = HearingsSearchComponent.DEFAULT_PAGING;
    totalCount: number;

    constructor(private hearingPartModificationService: HearingModificationService,
                private route: ActivatedRoute,
                private hearingService: HearingService,
                private dialog: MatDialog,
                private notesService: NotesService,
                private searchCriteriaService: SearchCriteriaService,
                @Inject('InMemoryStorageService') private storage: IStorage) {
        this.latestFilters = this.storage.getObject<HearingsFilters>(`${HearingsSearchComponent.STORAGE_KEY}.latestFilters`)
            || DEFAULT_HEARING_FILTERS;
        this.latestPaging = this.storage.getObject<PageEvent>(`${HearingsSearchComponent.STORAGE_KEY}.latestPaging`)
            || HearingsSearchComponent.DEFAULT_PAGING;
    }

    ngOnInit() {
        this.route.data.subscribe(({judges, hearingTypes, caseTypes}) => {
            this.judges = judges;
            this.hearingTypes = hearingTypes;
            this.caseTypes = caseTypes;
        });

        this.fetchHearings(this.latestFilters, this.latestPaging);
    }

    onNextPage(pageEvent: PageEvent) {
        this.latestPaging = pageEvent;
        this.storage.setObject<PageEvent>(`${HearingsSearchComponent.STORAGE_KEY}.latestPaging`, pageEvent);
        this.fetchHearings(this.latestFilters, pageEvent);
    }

    onFilter(filterValues: HearingsFilters) {
        this.latestFilters = filterValues;
        this.storage.setObject<HearingsFilters>(`${HearingsSearchComponent.STORAGE_KEY}.latestFilters`, filterValues);
        this.fetchHearings(filterValues, this.latestPaging)
    }

    onDelete(hearing: FilteredHearingViewmodel) {
        this.openDeleteDialog(hearing);
    }

    onAmend(hearingId: string) {
        let hearingSource$: Observable<HearingSearchResponseForAmendment> = this.hearingService.getForAmendment(hearingId);
        let hearingNotesSource$: Observable<Note[]> = this.notesService.getByEntities([hearingId]);

        forkJoin([hearingSource$, hearingNotesSource$]).pipe(mergeMap(([hearing, hearingNotes]) => {
                return this.openAmendDialog(hearing, hearingNotes).afterClosed();
            }),
            filter(amendedHearing => amendedHearing !== undefined),
            tap(amendedHearing => {
                this.hearingPartModificationService.updateListingRequest(amendedHearing);
                this.openDialog('Editing listing request', amendedHearing.notes);
            })
        ).subscribe()
    }

    private openDeleteDialog(hearing: FilteredHearingViewmodel) {
        this.dialog.open(DialogWithActionsComponent, {
            data: { message: `Do you want to remove the listing request for case number ${hearing.caseNumber} ?`}
        }).afterClosed().subscribe((dialogData) => {
            this.afterDeleteClosed(dialogData.confirmed, hearing)
        })
    }

    private openAmendDialog(hearing: HearingSearchResponseForAmendment, notes: Note[]) {
        const hearingAmendDialogData: HearingAmendDialogData = {
            hearingViewModel: { hearing, notes },
            judges: this.judges,
            caseTypes: this.caseTypes
        };
        return this.dialog.open(HearingAmendDialogComponent, {
            data: hearingAmendDialogData
        })
    }

    private afterDeleteClosed(confirmed, hearing) {
        if (confirmed) {
            this.hearingPartModificationService.deleteHearing({
                hearingId: hearing.id,
                hearingVersion: hearing.version,
                userTransactionId: undefined
            });

            this.openTransactionDialog().afterClosed().subscribe((success) => {
                this.fetchHearings(this.latestFilters, this.latestPaging);

                if (success) {
                    this.hearingPartModificationService.removeFromState(hearing.id);
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
        this.hearingService.seearchFilteredHearingViewmodels(this.toSearchHearingRequest(filterValues, pageEvent))
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

    private openDialog(actionTitle: string, notes: NoteViewmodel[]) {
        this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: {actionTitle}
        }).afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                if (notes.length > 0) {
                    this.notesService.upsertManyNotes(notes).subscribe(() => {
                        this.fetchHearings(this.latestFilters, this.latestPaging);
                        return;
                    });
                }
            } else {
                this.fetchHearings(this.latestFilters, this.latestPaging)
            }
        });
    }
}

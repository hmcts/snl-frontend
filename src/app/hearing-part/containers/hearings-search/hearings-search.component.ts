import { Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/of';
import { Judge } from '../../../judges/models/judge.model';
import { HearingsFilters } from '../../models/hearings-filter.model';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { SearchHearingRequest } from '../../models/search-hearing-request';
import { MatDialog, PageEvent } from '@angular/material';
import { ReferenceDataService } from '../../../core/reference/services/reference-data.service';
import { JudgeService } from '../../../judges/services/judge.service';
import { FilteredHearingViewmodel } from '../../models/filtered-hearing-viewmodel';
import { ListingUpdateDialogComponent } from '../../components/listing-update-dialog/listing-update-dialog';
import { NotesService } from '../../../notes/services/notes.service';
import { HearingModificationService } from '../../services/hearing-modification.service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import { NoteViewmodel } from '../../../notes/models/note.viewmodel';
import { filter } from 'rxjs/operators';
import { HearingService } from '../../../hearing/services/hearing.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

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

    judges: Judge[];
    caseTypes: CaseType[];
    hearingTypes: HearingType[];

    filteredHearings: FilteredHearingViewmodel[] = [];
    latestFilters: HearingsFilters;
    latestPaging = HearingsSearchComponent.DEFAULT_PAGING;
    totalCount: number;

    constructor(private hearingPartModificationService: HearingModificationService,
                private hearingService: HearingService,
                private dialog: MatDialog,
                private referenceDataService: ReferenceDataService,
                private judgeService: JudgeService,
                private notesService: NotesService,
                private searchCriteriaService: SearchCriteriaService) {
    }

    ngOnInit() {
        this.judgeService.fetch().subscribe(judges => {this.judges = judges});
        this.referenceDataService.fetchCaseTypes().subscribe(caseTypes => {this.caseTypes = caseTypes});
        this.referenceDataService.fetchHearingTypes().subscribe(hearingTypes => {this.hearingTypes = hearingTypes});
    }

    onAmend(hearingId: string) {
        let hearing = this.hearingService.getForAmendment(hearingId);
        let hearingNotes = this.notesService.getByEntities([hearingId]);

        forkJoin([hearing, hearingNotes]).subscribe(results => {
            this.dialog.open(ListingUpdateDialogComponent, {
                data: {
                    listing: {
                        hearing: results[0],
                        notes: results[1]
                    },
                    judges: this.judges,
                    caseTypes: this.caseTypes
                }
            }).afterClosed().pipe(filter(updatedListing => updatedListing !== undefined))
                .subscribe(updatedListing => {
                    this.hearingPartModificationService.updateListingRequest(updatedListing);
                    this.openDialog('Editing listing request', updatedListing.notes);
                })
        });
    }

    onNextPage(pageEvent: PageEvent) {
        this.latestPaging = pageEvent;
        this.fetchHearings(this.latestFilters, pageEvent);
    }

    onFilter(filterValues: HearingsFilters) {
        this.latestFilters = filterValues;
        this.fetchHearings(filterValues, this.latestPaging)
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
            ...TransactionDialogComponent.DEFAULT_DIALOG_CONFIG,
            data: {actionTitle}
        }).afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                if (notes.length > 0) {
                    this.notesService.upsertManyNotes(notes).subscribe(() => {
                        this.fetchHearings(this.latestFilters, this.latestPaging);
                        return;
                    });
                }

                this.fetchHearings(this.latestFilters, this.latestPaging)
            }
        });
    }
}

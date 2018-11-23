import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment'
import { SelectionModel } from '@angular/cdk/collections';
import { mapToUpdateHearingRequest } from '../../models/hearing-part.viewmodel';
import { NotesListDialogComponent } from '../../../notes/components/notes-list-dialog/notes-list-dialog.component';
import { ListingCreate } from '../../models/listing-create';
import { ListingCreateDialogComponent } from '../listing-create-dialog/listing-create-dialog';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { DialogWithActionsComponent } from '../../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import { getNoteViewModel } from '../../../notes/models/note.viewmodel';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HearingForListingWithNotes } from '../../models/hearing-for-listing-with-notes.model';
import { HearingService } from '../../../hearing/services/hearing.service';
import { v4 as uuid } from 'uuid';
import { filter, mergeMap, take, tap } from 'rxjs/operators';
import { TableSettings } from '../../models/table-settings.model';

@Component({
  selector: 'app-hearings-table',
  templateUrl: './hearings-table.component.html',
  styleUrls: ['./hearings-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingsTableComponent implements OnInit, OnChanges {
    public static DEFAULT_TABLE_SETTINGS: TableSettings = {
        pageSize: 10,
        pageIndex: 0,
        sortByProperty: 'case_type_description',
        sortDirection: 'asc'
    };

    @Input() hearings: HearingForListingWithNotes[];
    @Input() totalCount: number;
    @Output() selectHearing = new EventEmitter();
    @Output() onClearSelection = new EventEmitter();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    tableSettingsSource$: BehaviorSubject<TableSettings> =
        new BehaviorSubject<TableSettings>(HearingsTableComponent.DEFAULT_TABLE_SETTINGS);
    hearingSelectionModel: SelectionModel<HearingForListingWithNotes>;
    dataSource: MatTableDataSource<HearingForListingWithNotes>;
    displayedColumns = [
        'case_number',
        'case_title',
        'case_type_description',
        'hearing_type_description',
        'duration',
        'communication_facilitator',
        'priority',
        'reserved_judge_name',
        'number_of_sessions',
        'notes',
        'schedule_start',
        'schedule_end',
        'select_hearing',
        'delete',
        'editor'
    ];

    constructor(public dialog: MatDialog, public hearingService: HearingService) {
        this.hearingSelectionModel = new SelectionModel<HearingForListingWithNotes>(false, []);
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearings));
    }

    ngOnChanges() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearings));
    }

    parseDate(date) {
        return date ? moment(date).format('DD/MM/YYYY') : null;
    }

    hasNotes(hearing: HearingForListingWithNotes): boolean {
        return hearing.notes.length > 0;
    }

    openNotesDialog(hearing: HearingForListingWithNotes) {
        if (this.hasNotes(hearing)) {
            this.dialog.open(NotesListDialogComponent, {
                data: hearing.notes.map(getNoteViewModel),
                hasBackdrop: false,
                width: '30%'
            })
        }
    }

    openDeleteDialog(hearing: HearingForListingWithNotes) {
        this.clearSelection();

        this.dialog.open(DialogWithActionsComponent, {
            data: { message: `Do you want to remove the listing request for case number ${hearing.caseNumber} ?`}
        }).afterClosed().pipe(
            filter(confirmed => confirmed === true),
            tap(() => { this.deleteHearing(hearing) }),
            mergeMap(() => { return this.openTransactionDialog().afterClosed() }),
            filter(success => success === true),
            tap(() => this.tableSettingsSource$.next(this.tableSettingsSource$.getValue())),
            take(1))
        .subscribe();
    }

    openEditDialog(hearing: HearingForListingWithNotes) {
        this.clearSelection();

        this.dialog.open(ListingCreateDialogComponent, {
            data: {
                hearing: mapToUpdateHearingRequest(hearing),
                notes: hearing.notes
            } as ListingCreate,
            hasBackdrop: true,
            height: 'auto'
        });
    }

    toggleHearing(hearing: HearingForListingWithNotes) {
        this.hearingSelectionModel.toggle(hearing);
        this.selectHearing.emit(this.hearingSelectionModel.isSelected(hearing) ? hearing : undefined);
    }

    clearSelection() {
        this.hearingSelectionModel.clear();
        this.onClearSelection.emit();
    }

    private openTransactionDialog() {
        return this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: { actionTitle: 'Deleting hearing' }
        });
    }

    private deleteHearing(hearing: HearingForListingWithNotes) {
        this.hearingService.deleteHearing({
            hearingId: hearing.id,
            hearingVersion: hearing.version,
            userTransactionId: uuid()
        });
    }

    private nextTableSettingsValue() {
        const ts: TableSettings = {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sortByProperty: this.sort.active,
            sortDirection: this.sort.direction
        };

        this.tableSettingsSource$.next(ts)
    }
}

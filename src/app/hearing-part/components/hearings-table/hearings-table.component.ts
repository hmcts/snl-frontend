import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import * as moment from 'moment'
import { SelectionModel } from '@angular/cdk/collections';
import { mapToUpdateHearingRequest } from '../../models/hearing-part.viewmodel';
import { NotesListDialogComponent } from '../../../notes/components/notes-list-dialog/notes-list-dialog.component';
import { priorityValue } from '../../models/priority-model';
import { ListingCreate } from '../../models/listing-create';
import { ListingCreateDialogComponent } from '../listing-create-dialog/listing-create-dialog';
import { HearingModificationService } from '../../services/hearing-modification.service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { DialogWithActionsComponent } from '../../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import { getNoteViewModel } from '../../../notes/models/note.viewmodel';
import { HearingViewmodel } from '../../models/hearing.viewmodel';
import { DEFAULT_DIALOG_CONFIG } from '../../../features/transactions/models/default-dialog-confg';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-hearings-table',
  templateUrl: './hearings-table.component.html',
  styleUrls: ['./hearings-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingsTableComponent implements OnInit, OnChanges {
    public static DEFAULT_PAGING: PageEvent = {
        pageSize: 10,
        pageIndex: 0,
        length: undefined
    };

    paginationSource$: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(HearingsTableComponent.DEFAULT_PAGING);

    @Input() hearings: HearingViewmodel[];
    @Input() totalCount: number;
    @Output() selectHearing = new EventEmitter();
    @Output() onClearSelection = new EventEmitter();
    @Output() onNextPage = new EventEmitter<PageEvent>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    selectedHearing;

    dataSource: MatTableDataSource<HearingViewmodel>;
    displayedColumns = [
        'caseNumber',
        'caseTitle',
        'caseType',
        'hearingType',
        'duration',
        'communicationFacilitator',
        'priority',
        'reservedJudge',
        'requiredSessions',
        'notes',
        'scheduleStart',
        'scheduleEnd',
        'selectHearing',
        'delete',
        'editor'
    ];

    constructor(public dialog: MatDialog, public hearingService: HearingModificationService) {
        this.selectedHearing = new SelectionModel<HearingViewmodel>(false, []);
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearings));
        this.paginator.page.subscribe(pageEvent => this.onNextPage.emit(pageEvent))
    }

    ngOnChanges() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearings));

        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'duration':
                    return moment.duration(item[property]).asMilliseconds();
                case 'requiredSessions':
                    return item['numberOfSessions'];

                case 'reservedJudge':
                    return this.getPropertyMemberOrNull(item, property, 'name');

                case 'caseType':
                case 'hearingType':
                    return this.getPropertyMemberOrNull(item, property, 'description');

                case 'priority':
                    return priorityValue(item[property]);

                case 'scheduleStart':
                case 'scheduleEnd':
                    return (item[property]) ? item[property].unix() : null;

                case 'notes':
                    return (item[property] && item[property].length > 0) ? 'Yes' : 'No';

                default:
                    return item[property];
            }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    parseDate(date) {
        if (date) {
            return moment(date).format('DD/MM/YYYY');
        } else {
            return null;
        }
    }

    hasNotes(hearing: HearingViewmodel): boolean {
        return hearing.notes.length > 0;
    }

    openNotesDialog(hearing: HearingViewmodel) {
        if (this.hasNotes(hearing)) {
            this.dialog.open(NotesListDialogComponent, {
                data: hearing.notes.map(getNoteViewModel),
                hasBackdrop: false,
                width: '30%'
            })
        }
    }

    openDeleteDialog(hearing: HearingViewmodel) {
        this.clearSelection();

        this.dialog.open(DialogWithActionsComponent, {
        data: { message: `Do you want to remove the listing request for case number ${hearing.caseNumber} ?`}
      }).afterClosed().subscribe((confirmed) => {
          this.afterDeleteClosed(confirmed, hearing);
      })
    }

    afterDeleteClosed(confirmed, hearing) {
        if (confirmed) {
            this.hearingService.deleteHearing({
                hearingId: hearing.id,
                hearingVersion: hearing.version,
                userTransactionId: undefined
            });

            this.openTransactionDialog().afterClosed().subscribe((success) => {
                if (success) {
                    this.hearingService.removeFromState(hearing.id)
                }
            })
        }
    }

    openEditDialog(hearing: HearingViewmodel) {
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

    toggleHearing(hearing) {
        this.selectedHearing.toggle(hearing);
        this.selectHearing.emit(this.selectedHearing.isSelected(hearing) ? hearing : undefined);
    }

    clearSelection() {
        this.selectedHearing.clear();
        this.onClearSelection.emit();
    }

    private openTransactionDialog() {
        return this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: { actionTitle: 'Deleting hearing' }
        });
    }

    private getPropertyMemberOrNull(item: object, property: string, key: string ) {
        return (item[property]) ? item[property][key] : null;
    }
}

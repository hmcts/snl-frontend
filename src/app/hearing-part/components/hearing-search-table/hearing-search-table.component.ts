import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment'
// import { SelectionModel } from '@angular/cdk/collections';
import { HearingPartViewModel, mapToUpdateHearingPartRequest } from '../../models/hearing-part.viewmodel';
import { NotesListDialogComponent } from '../../../notes/components/notes-list-dialog/notes-list-dialog.component';
// import { priorityValue } from '../../models/priority-model';
import { ListingCreate } from '../../models/listing-create';
import { ListingCreateDialogComponent } from '../listing-create-dialog/listing-create-dialog';
import { HearingPartModificationService } from '../../services/hearing-part-modification-service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { DialogWithActionsComponent } from '../../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { ITransactionDialogData } from '../../../features/transactions/models/transaction-dialog-data.model';
import { enableDisplayCreationDetails, getNoteViewModel } from '../../../notes/models/note.viewmodel';
import { priorityValue } from '../../models/priority-model';

@Component({
  selector: 'app-hearing-search-table',
  templateUrl: './hearing-search-table.component.html',
  styleUrls: ['./hearing-search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingSearchTableComponent implements OnInit, OnChanges {
    @Input() hearingParts: HearingPartViewModel[];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    dataSource: MatTableDataSource<HearingPartViewModel>;
    displayedColumns = [
        'caseNumber',
        'caseTitle',
        'priority',
        'caseType',
        'hearingType',
        'communicationFacilitator',
        'reservedJudge',
        'scheduleStart',
        'scheduleEnd',
        // 'requestStatus',
        // 'sessionDate',
    ];

    constructor(public dialog: MatDialog, public hearingPartService: HearingPartModificationService) {
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearingParts));
    }

    ngOnChanges() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearingParts));

        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
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

    hasNotes(hearingPart: HearingPartViewModel): boolean {
        return hearingPart.notes.length > 0;
    }

    openNotesDialog(hearingPart: HearingPartViewModel) {
        if (this.hasNotes(hearingPart)) {
            this.dialog.open(NotesListDialogComponent, {
                data: hearingPart.notes.map(getNoteViewModel).map(enableDisplayCreationDetails),
                hasBackdrop: false,
                width: '30%'
            })
        }
    }

    openDeleteDialog(hearingPart: HearingPartViewModel) {
      this.dialog.open(DialogWithActionsComponent, {
        data: { message: `Do you want to remove the listing request for case number ${hearingPart.caseNumber} ?`}
      }).afterClosed().subscribe((confirmed) => {
          this.afterDeleteClosed(confirmed, hearingPart)
      })
    }

    afterDeleteClosed(confirmed, hearingPart) {
        if (confirmed) {
            this.hearingPartService.deleteHearingPart({
                hearingPartId: hearingPart.id,
                hearingPartVersion: hearingPart.version,
                userTransactionId: undefined
            });

            this.openTransactionDialog().afterClosed().subscribe((success) => {
                if (success) {
                    this.hearingPartService.removeFromState(hearingPart.id)
                }
            })
        }
    }

    openEditDialog(hearingPart: HearingPartViewModel) {
        this.dialog.open(ListingCreateDialogComponent, {
            data: {
                hearingPart: mapToUpdateHearingPartRequest(hearingPart),
                notes: hearingPart.notes
            } as ListingCreate,
            hasBackdrop: true,
            height: 'auto'
        })
    }

    private openTransactionDialog() {
        return this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...TransactionDialogComponent.DEFAULT_DIALOG_CONFIG,
            data: { actionTitle: 'Deleting hearing part' }
        });
    }

    private getPropertyMemberOrNull(item: object, property: string, key: string ) {
        return (item[property]) ? item[property][key] : null;
    }
}

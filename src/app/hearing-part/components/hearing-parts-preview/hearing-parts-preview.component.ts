import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment'
import { SelectionModel } from '@angular/cdk/collections';
import { HearingPartViewModel, mapToHearingPart } from '../../models/hearing-part.viewmodel';
import { NotesListDialogComponent } from '../../../notes/components/notes-list-dialog/notes-list-dialog.component';
import { priorityValue } from '../../models/priority-model';
import { DeleteHearingPartDialogComponent } from '../delete-hearing-part-dialog/delete-hearing-part-dialog.component';
import { ListingCreate } from '../../models/listing-create';
import { ListingCreateDialogComponent } from '../listing-create-dialog/listing-create-dialog';
import { HearingPartModificationService } from '../../services/hearing-part-modification-service';
import { TransactionDialogComponent } from '../../../features/transactions/components/transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-hearing-parts-preview',
  templateUrl: './hearing-parts-preview.component.html',
  styleUrls: ['./hearing-parts-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HearingPartsPreviewComponent implements OnInit, OnChanges {
    @Input() hearingParts: HearingPartViewModel[];
    @Input() sessions: SessionViewModel[];
    @Output() selectHearingPart = new EventEmitter();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    selectedHearingPart;

    dataSource: MatTableDataSource<HearingPartViewModel>;
    displayedColumns = [
      'selectHearing',
      'caseNumber',
      'caseTitle',
      'caseType',
      'hearingType',
      'duration',
      'communicationFacilitator',
      'priority',
      'reservedJudge',
      'notes',
      'scheduleStart',
      'scheduleEnd',
      'delete',
      'editor'
    ];

    constructor(public dialog: MatDialog, public hearingPartService: HearingPartModificationService) {
        this.selectedHearingPart = new SelectionModel<HearingPartViewModel>(false, []);
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearingParts));
    }

    ngOnChanges() {
        this.dataSource = new MatTableDataSource(Object.values(this.hearingParts));

        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'duration':
                    return moment.duration(item[property]).asMilliseconds();

                case 'reservedJudge':
                    return item[property] === undefined ? null : item[property].name;

                case 'priority':
                    return priorityValue(item[property]);

                default:
                    return item[property];
            }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    parseDate(date) {
        return moment(date).format('DD/MM/YYYY');
    }

    hasNotes(hearingPart: HearingPartViewModel): boolean {
        return hearingPart.notes.length > 0;
    }

    openNotesDialog(hearingPart: HearingPartViewModel) {
        if (this.hasNotes(hearingPart)) {
            this.dialog.open(NotesListDialogComponent, {
                data: hearingPart.notes,
                hasBackdrop: false,
                width: '30%'
            })
        }
    }

    openDeleteDialog(hearingPart: HearingPartViewModel) {
      this.dialog.open(DeleteHearingPartDialogComponent, {
        data: hearingPart
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

            this.openTransactionDialog().afterClosed().subscribe((accepted) => {
                if (accepted) {
                    this.hearingPartService.removeFromState(hearingPart.id)
                }
            })
        }
    }

    openEditDialog(hearingPart: HearingPartViewModel) {
        this.dialog.open(ListingCreateDialogComponent, {
            data: {
                hearingPart: mapToHearingPart(hearingPart),
                notes: hearingPart.notes
            } as ListingCreate,
            hasBackdrop: true,
            height: '60%'
        })
    }

    private openTransactionDialog() {
        return this.dialog.open(TransactionDialogComponent, {
            width: 'auto',
            minWidth: 350,
            hasBackdrop: true
        });
    }

    toggleHearing(hearing) {
        this.selectedHearingPart.toggle(hearing);
        this.selectHearingPart.emit(this.selectedHearingPart.isSelected(hearing) ? hearing : {});
    }
}

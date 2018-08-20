import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import * as moment from 'moment'
import { SelectionModel } from '@angular/cdk/collections';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';
import { NotesListDialogComponent } from '../../../notes/components/notes-list-dialog/notes-list-dialog.component';
import { priorityValue } from '../../models/priority-model';
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
    ];

    constructor(public dialog: MatDialog) {
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

    toggleHearing(hearing) {
        this.selectedHearingPart.toggle(hearing);
        this.selectHearingPart.emit(this.selectedHearingPart.isSelected(hearing) ? hearing : {});
    }
}

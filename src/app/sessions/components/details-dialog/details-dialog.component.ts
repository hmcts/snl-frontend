import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DialogPosition, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';
import * as moment from 'moment';
import { SessionViewModel } from '../../models/session.viewmodel';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent {

  constructor(
      public dialogRef: MatDialogRef<DetailsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private sessionsStatsService: SessionsStatisticsService) { }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    @HostListener('drag', ['$event'])
    @HostListener('dragend', ['$event'])
    drag(e: DragEvent) {
        this.dialogRef.updatePosition({left: `${e.x}px`, top: `${e.y}px`} as DialogPosition)
    }

    durationAsMinutes(duration: moment.Duration) {
      return moment.duration(duration).asMinutes();
    }

    calculateEndTime(session: SessionViewModel) {
      return moment(session.start).add(moment.duration(session.duration)).format('HH:mm');
    }

    getStartTime(session: SessionViewModel) {
      return moment(session.start).format('HH:mm');
    }

    calculateAllocatedHearingsDuration() {
       return this.sessionsStatsService.calculateAllocatedHearingsDuration(this.data.session);
    }

    calculateAvailableDuration(reservedDuration: string) {
       return this.sessionsStatsService.calculateAvailableDuration(moment.duration(reservedDuration),
           this.calculateAllocatedHearingsDuration());
    }
}

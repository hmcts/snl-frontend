import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DialogPosition, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SessionsStatisticsService } from '../../services/sessions-statistics-service';
import * as moment from 'moment';

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

    @HostListener('dragstart', ['$event'])
    dragStart(e) {
        console.log(e);
    }

    @HostListener('dragend', ['$event'])
    dragEnd(e) {
      this.dialogRef.updatePosition({left: `${e.x}px`, top: `${e.y}px`} as DialogPosition)
    }

    durationAsMinutes(duration) {
      return moment.duration(duration).asMinutes();
    }

    parseDate(date) {
      return moment(date).format('DD/MM/YYYY');
    }

    calculateEndTime(session) {
      return moment(session.start).add(moment.duration(session.duration)).format('HH:mm');
    }

    getStartTime(session) {
      return moment(session.start).format('HH:mm');
    }

    calculateAllocated() {
       return this.sessionsStatsService.calculateAllocated(this.data.session);
    }

    calculateAvailable() {
       return this.sessionsStatsService.calculateAvailable(this.data.session.duration, this.calculateAllocated());
    }

    calculateUtilized() {
       return this.sessionsStatsService.calculateUtilized(this.data.session.duration, this.calculateAllocated());
    }
}

import { Component, OnInit } from '@angular/core';
import { HearingService } from '../../services/hearing.service';
import { Hearing, Session } from '../../models/hearing';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-hearing',
  templateUrl: './view-hearing.component.html',
  styleUrls: ['./view-hearing.component.scss']
})
export class ViewHearingComponent implements OnInit {
  hearing: Hearing;

  constructor(
    private route: ActivatedRoute,
    private readonly hearingService: HearingService
  ) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')
    this.hearingService.getById(id).subscribe(h => {
      this.hearing = h;
    });
  }

  formatDate(date: string): string {
    return moment(date).format();
  }

  formatDuration(duration: number): string {
    const minutes = moment.duration(duration).asMinutes();

    return Math.ceil(minutes) + ' minutes';
  }

  getListBetween() {
    if(!this.hearing.scheduleStart && !this.hearing.scheduleEnd) {
      return '';
    }

    if(this.hearing.scheduleStart && !this.hearing.scheduleEnd) {
      return 'after ' + this.formatDate(this.hearing.scheduleStart);
    }

    if(!this.hearing.scheduleStart && this.hearing.scheduleEnd) {
      return 'before ' + this.formatDate(this.hearing.scheduleEnd);
    }

    if(this.hearing.scheduleStart && this.hearing.scheduleEnd) {
      return this.formatDate(this.hearing.scheduleStart)
        + ' - '
        + this.formatDate(this.hearing.scheduleEnd);
    }
  }

  isSessionPanelDisabled(session: Session) {
    return session.notes === undefined || session.notes.length === 0;
  }
}

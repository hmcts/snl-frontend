import { Component, OnInit } from '@angular/core';
import { HearingService } from '../../services/hearing.service';
import { Hearing, Session } from '../../models/hearing';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-view-hearing',
  templateUrl: './view-hearing.component.html',
  styleUrls: ['./view-hearing.component.scss']
})
export class ViewHearingComponent implements OnInit {
  hearing: Hearing;
  hearingId
  constructor(
    private route: ActivatedRoute,
    private readonly hearingService: HearingService
  ) {
  }

  ngOnInit() {
    this.hearingId = this.route.snapshot.paramMap.get('id');
    this.hearingService.hearings
      .map(hearings => hearings.find(h => h.id === this.hearingId))
      .subscribe(hearing => this.hearing = hearing);

      this.fetchHearing()
  }

  private fetchHearing() {
    this.hearingService.getById(this.hearingId);
  }

  formatDate(date: string): string {
    return moment(date).format();
  }

  formatDuration(duration: string): string {
    const minutes = moment.duration(duration).asMinutes();

    return Math.ceil(minutes) + ' minutes';
  }

  getListBetween() {
    const start = this.hearing.scheduleStart;
    const end = this.hearing.scheduleEnd;

    if (!start && !end) {
      return '';
    }

    if (start && !end) {
      return 'after ' + this.formatDate(start);
    }

    if (!start && end) {
      return 'before ' + this.formatDate(end);
    }

    if (start && end) {
      return this.formatDate(start)
        + ' - '
        + this.formatDate(end);
    }
  }

  isSessionPanelDisabled(session: Session) {
    return session.notes === undefined || session.notes.length === 0;
  }
}

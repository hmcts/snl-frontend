import { Component, OnInit } from '@angular/core';
import { HearingService } from '../../services/hearing.service';
import { Hearing, Session } from '../../models/hearing';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { formatDuration} from '../../../utils/date-utils';

@Component({
  selector: 'app-view-hearing',
  templateUrl: './view-hearing.component.html',
  styleUrls: ['./view-hearing.component.scss']
})
export class ViewHearingComponent implements OnInit {
  hearing: Hearing;

  constructor(
    private route: ActivatedRoute,
    private readonly hearingService: HearingService,
    private readonly location: Location
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

  formatDuration(duration: string): string {
    return formatDuration(moment.duration(duration))
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

  goBack() {
    this.location.back();
  }
}

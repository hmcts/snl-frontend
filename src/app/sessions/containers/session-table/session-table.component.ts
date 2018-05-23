import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material';
import * as fromSessions from '../../reducers';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionViewModel } from '../../models/session.viewmodel';

@Component({
  selector: 'app-session-table',
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.css']
})
export class SessionTableComponent implements OnInit, OnChanges {

  @Output()
  selectSession = new EventEmitter();

  @Input() sessions: SessionViewModel[];

  selectedSesssion;
  displayedColumns = [
      'position',
      'date',
      'time',
      'duration',
      'room',
      'casetype',
      'hearings',
      'allocated',
      'utilisation',
      'available',
      'select session'
  ];
  dataSource: MatTableDataSource<any>;
  tableVisible;

  constructor() {
    this.selectedSesssion = new SelectionModel<SessionViewModel>(false, []);

    this.tableVisible = false;

    this.dataSource = new MatTableDataSource(this.sessions);
  }

  parseDate(date) {
      return moment(date).format('DD/MM/YYYY');
  }

  humanizeDuration(duration) {
      return moment.duration(duration).humanize();
  }

  calculateAllocated(session) {
    let allocated = moment.duration();
    session.hearingParts.forEach(hearingPart => {
        allocated.add(moment.duration(hearingPart.duration));
    })
    return allocated;
  }
 
  calculateUtilized(duration: string, allocated: moment.Duration) {
    return Math.round((allocated.asMinutes() / moment.duration(duration).asMinutes()) * 100);
  }

  calculateAvailable(duration: string, allocated: moment.Duration) {
    let available = moment.duration(duration).asMinutes() - allocated.asMinutes();
    return available > 0 ? available : 0;
  }

  toggleSession(session) {
    this.selectedSesssion.toggle(session);
    this.selectSession.emit(this.selectedSesssion.isSelected(session) ? session : {})
  }

  ngOnInit() {
  }

  ngOnChanges() {
      if (this.sessions) {
          this.tableVisible = true;
      }

      this.sessions.map(element => {
          element.start = new Date(element.start);
      });
      this.dataSource = new MatTableDataSource(this.sessions);
  }

}

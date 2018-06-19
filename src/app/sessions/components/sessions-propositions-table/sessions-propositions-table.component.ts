import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-sessions-propositions-table',
  templateUrl: './sessions-propositions-table.component.html',
  styleUrls: ['./sessions-propositions-table.component.scss']
})
export class SessionsPropositionsTableComponent implements OnInit, OnChanges {

  @Input() sessionPropositions: any[];

  displayedColumns = [
      'date',
      'startTime',
      'endTime',
      'judge',
      'room',
  ];
  dataSource: MatTableDataSource<any>;
  tableVisible;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
      if (this.sessionPropositions) {
          this.tableVisible = true;

          this.sessionPropositions.map(element => {
              element.startTime = moment(element.start).format('HH:mm');
              element.endTime = moment(element.end).format('HH:mm');
              element.start = moment(element.start).format('DD MMM YYYY');

          });
          this.dataSource = new MatTableDataSource(this.sessionPropositions);
      }

  }

}

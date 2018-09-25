import { Component, OnInit } from '@angular/core';
import { PocService } from '../../services/poc-service';
import * as moment from 'moment'

@Component({
  selector: 'app-poc',
  templateUrl: './poc.component.html',
  styleUrls: ['./poc.component.scss']
})
export class PocComponent implements OnInit {

  loadRulesFromDbResult: string;
  timeSet: string;
  yearRequestBody = {timeType: 'year', value: +moment().format('YYYY')} as TimeRequestBody;
  monthRequestBody = {timeType: 'month', value: +moment().format('M')} as TimeRequestBody;
  dayRequestBody = {timeType: 'day', value: +moment().format('D')} as TimeRequestBody;
  hourRequestBody = {timeType: 'hour', value: 0} as TimeRequestBody;
  minuteRequestBody = {timeType: 'minute', value: 0} as TimeRequestBody;

  constructor(private readonly pocService: PocService) {
  }

  ngOnInit() {
  }

  loadRulesFromDb() {
    this.pocService.loadRulesFromDb()
      .subscribe(data => this.loadRulesFromDbResult = data,
          error => this.loadRulesFromDbResult = error.status);
  }

  setTime(requestBody: TimeRequestBody) {
    this.pocService.inputTime(requestBody)
        .subscribe(data => this.timeSet = data,
            error => this.timeSet = error.status);
  }
}

export interface TimeRequestBody {
    timeType: string,
    value: number
}

import { Component, OnInit } from '@angular/core';
import { PocService } from '../../services/poc-service';

@Component({
  selector: 'app-poc',
  templateUrl: './poc.component.html',
  styleUrls: ['./poc.component.scss']
})
export class PocComponent implements OnInit {

  loadRulesFromDbResult: string;
  timeSet: string;
  yearRequestBody = {timeType: 'upsert-year', id: 'YEAR', value: 0} as TimeRequestBody;
  monthRequestBody = {timeType: 'upsert-month', id: 'MONTH', value: 0} as TimeRequestBody;
  dayRequestBody = {timeType: 'upsert-day', id: 'DAY', value: 0} as TimeRequestBody;
  hourRequestBody = {timeType: 'upsert-hour', id: 'HOUR', value: 0} as TimeRequestBody;
  minuteRequestBody = {timeType: 'upsert-minute', id: 'MINUTE', value: 0} as TimeRequestBody;

  constructor(private pocService: PocService) {
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
    id: string,
    value: number
}

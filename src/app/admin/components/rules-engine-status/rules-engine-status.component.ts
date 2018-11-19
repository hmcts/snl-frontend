import { Component, OnInit } from '@angular/core';
import { ReloadStatusResponse } from '../../models/rules-engine/reload-status-response';
import { RulesEngineService } from '../../services/rules-engine/rules-engine-service';
import * as moment from 'moment';

@Component({
  selector: 'app-rules-engine-status',
  templateUrl: './rules-engine-status.component.html',
  styleUrls: ['./rules-engine-status.component.scss']
})
export class RulesEngineStatusComponent implements OnInit {

  reloadStatuses: ReloadStatusResponse[];

  constructor(private readonly rulesEngineService: RulesEngineService) {
  }

  ngOnInit() {
      this.rulesEngineService.getStatus()
        .subscribe(data => this.reloadStatuses = data);
  }

  formatDate(date: string): string {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }
}

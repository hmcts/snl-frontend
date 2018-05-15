import { Component, OnInit } from '@angular/core';
import { PocService } from '../../services/poc-service';

@Component({
  selector: 'app-poc',
  templateUrl: './poc.component.html',
  styleUrls: ['./poc.component.scss']
})
export class PocComponent implements OnInit {

  loadRulesFromDbResult: string;

  constructor(private pocService: PocService) {
  }

  ngOnInit() {
  }

  loadRulesFromDb() {
    this.pocService.loadRulesFromDb()
      .subscribe(data => this.loadRulesFromDbResult = data,
          error => this.loadRulesFromDbResult = error.status);
  }

}

import { ProblemReference } from '../../models/problem-reference.model';
import { Component, Input, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { MatPaginator, PageEvent } from '@angular/material';
import { Moment } from 'moment';

@Component({
  selector: 'app-problems-table',
  templateUrl: './problems-table.component.html',
  styleUrls: ['./problems-table.component.scss']
})
export class ProblemsTableComponent implements OnInit  {
  displayedColumns = ['severity', 'createdAt', 'message', 'references description'];
  initialPageSize = 20

  @Input() totalCount: number;
  @Input() problems: Problem[]
  @Output() nextPage = new EventEmitter<PageEvent>()
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.paginator.page.subscribe(pageEvent => this.nextPage.emit(pageEvent))
    this.nextPage.emit(
      {
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize || this.initialPageSize,
        length: undefined
      }
    )
  }

  extractRefDescriptions(element: Problem): string[] {
    return element.references
      .map((reference: ProblemReference) => `${reference.entity}: ${reference.description}`);
  }

  formatDate(date: Moment): string {
    return date.format('DD/MM/YYYY HH:mm')
  }
}

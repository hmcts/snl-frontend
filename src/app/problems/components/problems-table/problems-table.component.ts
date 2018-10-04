import { ProblemReference } from '../../models/problem-reference.model';
import { Component, Input, ViewChild } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Moment } from 'moment';

@Component({
  selector: 'app-problems-table',
  templateUrl: './problems-table.component.html',
  styleUrls: ['./problems-table.component.scss']
})
export class ProblemsTableComponent {
  displayedColumns = ['severity', 'createdAt', 'message', 'references description'];
  dataSource: MatTableDataSource<Problem>;

  private _problems: Problem[];
  @Input() set problems(problems: Problem[]) {
    this._problems = problems;
    this.dataSource = new MatTableDataSource(Object.values(this.problems));
    this.dataSource.paginator = this.paginator;
  }

  get problems(): Problem[] {
    return this._problems;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  extractRefDescriptions(element: Problem): string[] {
    return element.references
      .map((reference: ProblemReference) => `${reference.entity}: ${reference.description}`);
  }

  formatDate(date: Moment): string {
    return date.format('DD/MM/YYYY HH:mm')
  }
}

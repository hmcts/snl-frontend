import { ProblemReference } from './../../models/problem-reference.model';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-problems-table',
  templateUrl: './problems-table.component.html',
  styleUrls: ['./problems-table.component.scss']
})
export class ProblemsTableComponent implements OnInit, OnChanges {
  displayedColumns = ['id', 'message', 'references title'];
  dataSource;

  @Input() problems: Problem[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(Object.values(this.problems));
    this.dataSource.paginator = this.paginator;
  }

  extractRefDescriptions(element: Problem): string[] {
    return element.references
      .map((reference: ProblemReference) => `${reference.entity}: ${reference.description}`);
  }
}

import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-problems',
  templateUrl: './problems-table.component.html',
  styleUrls: ['./problems-table.component.scss']
})
export class ProblemsTableComponent implements OnInit, OnChanges {
  displayedColumns = ['id', 'message'];
  dataSource;

  @Input()
  problems: Problem[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  ngOnInit() {
  }

  ngOnChanges() {
      this.dataSource = new MatTableDataSource(Object.values(this.problems));
      this.dataSource.paginator = this.paginator;
  }

}

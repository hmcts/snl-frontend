import { Component } from '@angular/core';
import { Problem, Page } from '../../models/problem.model';
import { ProblemsService } from '../../services/problems.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-problems-page',
  templateUrl: './problems-page.component.html',
  styleUrls: ['./problems-page.component.scss']
})
export class ProblemsPageComponent {
    problems: Problem[] = [];
    totalCount = 0

    constructor(private readonly problemsService: ProblemsService) { }

    fetchProblems(pageEvent: PageEvent) {
        this.problemsService
            .getAll(pageEvent.pageSize, pageEvent.pageIndex)
            .subscribe((pagedProblems: Page<Problem>) => {
                this.problems = pagedProblems.content;
                this.totalCount = pagedProblems.totalElements
            })
    }
}

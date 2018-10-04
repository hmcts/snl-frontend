import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { ProblemsService } from '../../services/problems.service';

@Component({
  selector: 'app-problems-page',
  templateUrl: './problems-page.component.html',
  styleUrls: ['./problems-page.component.scss']
})
export class ProblemsPageComponent implements OnInit {
    problems: Problem[] = [];

    constructor(private readonly problemsService: ProblemsService) { }

    ngOnInit() {
        this.problemsService.getAll().subscribe(problems => this.problems = problems);
    }
}

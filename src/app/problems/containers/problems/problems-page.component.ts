import { Component, OnInit } from '@angular/core';
import { Problem, isGreater, Severity } from '../../models/problem.model';
import * as fromProblems from '../../reducers';
import * as fromProblemsPartsActions from '../../actions/problem.action'
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-problems-page',
  templateUrl: './problems-page.component.html',
  styleUrls: ['./problems-page.component.scss']
})
export class ProblemsPageComponent implements OnInit {

    problems: Problem[] = [];

    constructor(private readonly store: Store<fromProblems.State>) {
        this.store.select(fromProblems.getProblems).pipe(
            map(data => data ? Object.values(data) : []),
            map(this.sortByCreatedAtDescending),
            map(this.sortBySeverity)
        ).subscribe(problems => this.problems = problems)
    }

    ngOnInit() {
        this.store.dispatch(new fromProblemsPartsActions.Get())
    }

    sortBySeverity(problems: Problem[]): Problem[] {
        return problems.sort((a, b) => {
            const aSeverity = Severity[a.severity] || Severity.Warning
            const bSeverity = Severity[b.severity] || Severity.Warning
            if (aSeverity === bSeverity) {
                return 0
            } else if (isGreater(aSeverity, bSeverity)) {
                return -1;
            } else {
                return 1;
            }
        });
    }

    sortByCreatedAtDescending(problems: Problem[]): Problem[] {
        return problems.sort((a, b) => {
            if (!a.createdAt.isValid()) {
                return 1;
            } else if (!b.createdAt.isValid()) {
                return -1;
            } else {
                return b.createdAt.diff(a.createdAt)
            }
        });
    }
}

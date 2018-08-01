import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Problem } from '../../models/problem.model';
import * as fromProblems from '../../reducers';
import * as fromProblemsPartsActions from '../../actions/problem.action'
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-problems-page',
  templateUrl: './problems-page.component.html',
  styleUrls: ['./problems-page.component.scss']
})
export class ProblemsPageComponent implements OnInit {

    problems$: Observable<Problem[]>;

    constructor(private readonly store: Store<fromProblems.State>) {
        this.problems$ = this.store.pipe(select(fromProblems.getProblemsEntities), map(data => data ? Object.values(data) : []));
    }

    ngOnInit() {
        this.store.dispatch(new fromProblemsPartsActions.Get())
    }

}

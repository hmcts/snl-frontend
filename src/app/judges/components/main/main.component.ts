import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../../security/services/security.service';
import { select, Store } from '@ngrx/store';
import { State } from '../../../app.state';
import * as fromJudges from '../../reducers/index';
import * as judgesActions from '../../actions/judge.action';
@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    judge = '"Unknown name"';

    constructor(private security: SecurityService, private store: Store<State>) {
        this.store.dispatch(new judgesActions.Get());
        this.store.pipe(select(fromJudges.getJudges)).subscribe(console.log);
    }

    ngOnInit() {
        this.judge = this.security.currentUser.username;
        // TODO do a call to get the full user Name
    }

}

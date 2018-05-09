import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Search } from '../../actions/session.action';
import { DatePipe } from '@angular/common';
import { HearingPart } from '../../../hearing-part/models/hearing-part';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { State } from '../../../app.state';
import * as fromHearingParts from '../../../hearing-part/reducers/hearing-part.reducer';

@Component({
  selector: 'app-sessions-search',
  templateUrl: './sessions-search.component.html',
  styleUrls: ['./sessions-search.component.scss']
})
export class SessionsSearchComponent implements OnInit {

    chosenDate;
    hearingParts$: Observable<HearingPart[]>;

    constructor(private store: Store<State>) {
        this.hearingParts$ = this.store.pipe(select(fromHearingParts.getHearingPartEntities));
    }

    ngOnInit() {
    }

    getSessions(date) {
        date = new DatePipe('en-US').transform(date, 'dd-MM-yyyy');

        this.store.dispatch(new Search({date: date}));
    }

    assignToSession(event) {
        console.log(event);
    }

}

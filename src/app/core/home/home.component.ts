import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../security/services/security.service';
import { Store } from '@ngrx/store';
import { GetAllCaseType, GetAllHearingType } from '../reference/actions/reference-data.action';
import { State } from '../index';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    error;

    constructor(private readonly security: SecurityService,
                private readonly store: Store<State>) {
    }

    isInRole(roleType: string) {
        return this.security.currentUser.hasRole(roleType);
    }

    authenticated() {
        return this.security.isAuthenticated();
    }

    ngOnInit(): void {
        this.store.dispatch(new GetAllCaseType());
        this.store.dispatch(new GetAllHearingType());
    }
}

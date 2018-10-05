import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../security/services/security.service';
import { Store } from '@ngrx/store';
import {
    GetAllCaseType,
    GetAllHearingType,
    GetAllRoomType,
    GetAllSessionType
} from '../reference/actions/reference-data.action';
import { State } from '../index';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    error;

    items = [];

    navigation = {};

    serviceName = {};

    constructor(private readonly security: SecurityService,
                private readonly store: Store<State>) {
    }

    isInRole(roleType: string) {
        return this.security.getCurrentUser().hasRole(roleType);
    }

    authenticated() {
        return this.security.isAuthenticated();
    }

    ngOnInit(): void {
        this.store.dispatch(new GetAllCaseType());
        this.store.dispatch(new GetAllHearingType());
        this.store.dispatch(new GetAllRoomType());
        this.store.dispatch(new GetAllSessionType());

        this.items = this.buildNavigationItems();

        this.navigation = {
            label: 'Scheduling and listing',
            items: [
                {
                    href: null,
                    text: 'Logged in as: ' + this.security.getCurrentUser().username
                },
                {
                    href: '/logout',
                    text: 'Logout'
                }
            ]
        }

        this.serviceName = {
            href: '#',
            name: 'Scheduling and listing'
        }
    }

    private buildNavigationItems() {
        if (this.isInRole('officer')) {
            return [
                {
                    text: 'Main',
                    href: '/',
                    children: [],
                },
                {
                    text: 'Listings',
                    href: 'listinghearings/assign',
                    children: [
                        {
                            text: 'List Hearings',
                            href: 'listinghearings/assign'
                        }, {
                            text: 'Search Sessions',
                            href: 'sessions/search'
                        }, {
                            text: 'Find availability',
                            href: 'sessions/search-proposition'
                        }, {
                            text: 'New Listing Request',
                            href: 'listing'
                        }, {
                            text: 'New Session',
                            href: 'sessions/create'
                        },
                    ]
                },
                {
                    text: 'Calendar',
                    href: 'calendar',
                    children: [],
                },
                {
                    text: 'Planner',
                    href: 'planner',
                    children: [],
                },
                {
                    text: 'Problems',
                    href: 'problems',
                    children: [],
                },
                {
                    text: 'Reports',
                    href: 'reports/unlisted',
                    children: [
                        {
                            text: 'Unlisted Hearings Requests',
                            href: 'reports/unlisted'
                        }
                    ]
                }
            ];
        }

        if (this.isInRole('judge')) {
            return [
                {
                    text: 'Main',
                    href: '/home/judge/main',
                    children: [],
                },
                {
                    text: 'Calendar',
                    href: '/home/judge/diary-calendar',
                    children: [],
                },
                {
                    text: 'Problems',
                    href: 'problems',
                    children: [],
                },
                {
                    text: 'Reports',
                    href: null,
                    children: [
                        {
                            text: 'Listed Hearings Requests',
                            href: 'reports/listed'
                        }
                    ]
                }
            ];
        }
    }
}

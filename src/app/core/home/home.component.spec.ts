import { HomeComponent } from './home.component';
import { Store } from '@ngrx/store';
import { State } from '../index';
import { User } from '../../security/models/user.model';
import { SecurityService } from '../../security/services/security.service';

let component: HomeComponent;
let securityService: jasmine.SpyObj<SecurityService>;
let store: Store<State>;

const officerResponse = {
    'authorities': [
        {'authority': 'ROLE_USER'},
        {'authority': 'ROLE_OFFICER'}],
    'username': 'officer1',
    'accountNonExpired': true,
    'accountNonLocked': true,
    'credentialsNonExpired': true,
    'enabled': true
};

const judgeResponse = {
    'authorities': [
        {'authority': 'ROLE_USER'},
        {'authority': 'ROLE_JUDGE'}],
    'username': 'officer1',
    'accountNonExpired': true,
    'accountNonLocked': true,
    'credentialsNonExpired': true,
    'enabled': true
};

const navigationItemsForJudge = [
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

const navigationItemsForOfficer = [
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

const serviceName = {
    href: '#',
    name: 'Scheduling and listing'
};

const exampleOfficer = Object.assign(new User(), officerResponse);

const exampleJudge = Object.assign(new User(), judgeResponse);

const baseNavigation = {
    label: 'Scheduling and listing',
    items: [
        {
            href: null,
            text: 'Logged in as: ' + 'officer1'
        },
        {
            href: '/logout',
            text: 'Logout'
        }
    ]
};

describe('HomeComponent', () => {
    beforeEach(() => {
        securityService = jasmine.createSpyObj('SecurityService', ['getCurrentUser']);
        store = jasmine.createSpyObj('store', ['dispatch']);
        component = new HomeComponent(securityService, store);
    });

    describe('Initial state ', () => {
        it('component should be initialized', () => {
            securityService.getCurrentUser.and.returnValue(exampleJudge);

            component.ngOnInit()

            expect(component).toBeTruthy();
            expect(component.serviceName).toEqual(serviceName);
        });

        describe('base navigation should be set correctly', () => {
            it('for judge', () => {
               securityService.getCurrentUser.and.returnValue(exampleJudge);

               component.ngOnInit();

               expect(component.navigation).toEqual(baseNavigation);
            });
            it('for officer', () => {
                securityService.getCurrentUser.and.returnValue(exampleOfficer);

                component.ngOnInit();

                expect(component.navigation).toEqual(baseNavigation);
            });
        });

        describe('Navigation for role', () => {
            it('judge should be set correctly', () => {
                securityService.getCurrentUser.and.returnValue(exampleJudge);

                component.ngOnInit();

                expect(component.items).toEqual(navigationItemsForJudge);
            });

            it('officer should be set correctly', () => {
                securityService.getCurrentUser.and.returnValue(exampleOfficer);

                component.ngOnInit();

                expect(component.items).toEqual(navigationItemsForOfficer);
            });
        })

    });
});

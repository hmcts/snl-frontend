import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionsFilterComponent } from './sessions-filter.component';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { SessionFilters } from '../../models/session-filter.model';
import * as moment from 'moment';

let fixture: ComponentFixture<SessionsFilterComponent>;
let component: SessionsFilterComponent;

function createFiltersStub() {
    return {
        sessionTypes: [],
        rooms: [],
        judges: [],
        startDate: moment(),
        endDate: moment().add(1, 'day'),
        utilization: {
            unlisted: {
                active: false,
                from: 0,
                to: 0
            },
            partListed: {
                active: false,
                from: 1,
                to: 99
            },
            fullyListed: {
                active: false,
                from: 100,
                to: 100
            },
            overListed: {
                active: false,
                from: 101,
                to: Infinity
            },
            custom: {
                active: false,
                from: 0,
                to: 0
            }
        }
    } as SessionFilters;
}

describe('SessionsFilterComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AngularMaterialModule, FormsModule],
            declarations: [SessionsFilterComponent]
        });
        fixture = TestBed.createComponent(SessionsFilterComponent);
        component = fixture.componentInstance;
    });
    it('should create', () => {
        expect(component).toBeDefined();
    });

    describe('sendFilter', () => {
        it('should emit filters', () => {
            const mockedFilters = createFiltersStub();

            const filterEmit = spyOn(component.filter, 'emit');
            component.filters = mockedFilters;
            component.sendFilter();
            expect(filterEmit).toHaveBeenCalledWith(mockedFilters);
        });

        it('should emit filters via sessionFilters$', (done) => {
            const mockedFilters = createFiltersStub();

            component.sessionFilter$.subscribe(filters => {
                expect(filters).toEqual(mockedFilters);
                done()
            });

            component.filters = mockedFilters;
            component.sendFilter();
        });
    });

    describe('isValid', () => {
        it('should return false for end-date Days before start-date', () => {
            const nowDateTime = moment();
            const filterStub = createFiltersStub();
            filterStub.startDate = nowDateTime.clone().add(1, 'day');
            filterStub.endDate = nowDateTime;

            component.filters = filterStub;
            expect(component.isValid()).toBeFalsy();
        });

        it('should return true for end-date Days equal start-date', () => {
            const nowDateTime = moment();
            const filterStub = createFiltersStub();
            filterStub.startDate = nowDateTime.clone();
            filterStub.endDate = nowDateTime;

            component.filters = filterStub;
            expect(component.isValid()).toBeTruthy();
        });

        it('should return true for end-date Days bigger than start-date', () => {
            const nowDateTime = moment();
            const filterStub = createFiltersStub();
            filterStub.startDate = nowDateTime;
            filterStub.endDate = nowDateTime.clone().add(1, 'day');

            component.filters = filterStub;
            expect(component.isValid()).toBeTruthy();
        });

        it('should return true when startDate is null', () => {
            const filterStub = createFiltersStub();
            filterStub.startDate = null;
            filterStub.endDate = moment().clone().add(1, 'day');

            component.filters = filterStub;
            expect(component.isValid()).toBeTruthy();
        });

        it('should return true when endDate is null and startDate is null', () => {
            const filterStub = createFiltersStub();
            filterStub.startDate = null;
            filterStub.endDate = null;

            component.filters = filterStub;
            expect(component.isValid()).toBeTruthy();
        });
    });
});

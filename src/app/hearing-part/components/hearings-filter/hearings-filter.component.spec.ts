import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearingsFilterComponent } from './hearings-filter.component';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { HearingsFilters } from '../../models/hearings-filter.model';

let fixture: ComponentFixture<HearingsFilterComponent>;
let component: HearingsFilterComponent;

describe('HearingsFilterComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AngularMaterialModule, FormsModule],
            declarations: [HearingsFilterComponent]
        });
        fixture = TestBed.createComponent(HearingsFilterComponent);
        component = fixture.componentInstance;
    });
    it('should create', () => {
        expect(component).toBeDefined();
    });

    describe('sendFilter', () => {
        it('should emit filters', () => {
            const mockedFilters: HearingsFilters = {
                caseNumber: '',
                caseTitle: '',
                priorities: [],
                caseTypes: [],
                hearingTypes: [],
                communicationFacilitators: [],
                judges: [],
                listingDetails: ''
            };

            const filterEmit = spyOn(component.filter, 'emit');
            component.filters = mockedFilters;
            component.sendFilter();
            expect(filterEmit).toHaveBeenCalledWith(mockedFilters);
        });
    });
});

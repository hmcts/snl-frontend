import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HearingsFilterComponent } from './hearings-filter.component';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { HearingsFilters } from '../../models/hearings-filter.model';
import * as moment from 'moment';

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
        hearingTypes: [],
        caseTypes: [],
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
      };

      const filterEmit = spyOn(component.filter, 'emit');
      component.filters = mockedFilters;
      component.sendFilter();
      expect(filterEmit).toHaveBeenCalledWith(mockedFilters);
    });
  });
});

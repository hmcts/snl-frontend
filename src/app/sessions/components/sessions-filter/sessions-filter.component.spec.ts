import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SessionsFilterComponent } from './sessions-filter.component';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { SessionFilters } from '../../models/session-filter.model';
import * as moment from 'moment';

let fixture: ComponentFixture<SessionsFilterComponent>;
let component: SessionsFilterComponent;

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
      const mockedFilters: SessionFilters = {
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
      };

      const filterEmit = spyOn(component.filter, 'emit');
      component.filters = mockedFilters;
      component.sendFilter();
      expect(filterEmit).toHaveBeenCalledWith(mockedFilters);
    });
  });
});

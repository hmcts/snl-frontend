import { CalendarComponent } from './calendar.component';
import { IcalendarTransformer } from '../transformers/icalendar-transformer';
import { NgFullCalendarComponent } from '../../../common/ng-fullcalendar/ng-full-calendar.component';
import * as moment from 'moment';

let component: CalendarComponent;
const testData: any[] = ['one', 'two', 'three'];
const testTransformer: IcalendarTransformer<string> = {
  transform: (element: string) => {
    return element;
  }
};

describe('CalendarComponent', () => {
  beforeEach(() => {
    component = new CalendarComponent();
  });

  describe('preTransformedData', () => {
    it('should set events when value is defined', () => {
      component.dataTransformer = testTransformer;
      component.preTransformedData = testData;

      expect(component.events).toEqual(testData);
    });
    it('should not set events when  value is undefined', () => {
      component.dataTransformer = testTransformer;
      component.preTransformedData = undefined;

      expect(component.events).not.toBeDefined();
    });
  });

  describe('resources', () => {
    it('should set resources when value is defined', () => {
      component.resources = testData;
      expect(component._resources).toEqual(testData);
    });
  });

  describe('constructor', () => {
    it('should set header', () => {
      const expectedHeader = {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      };
      expect(component.header).toEqual(expectedHeader);
    });
    it('should set empty views', () => {
      expect(component.views).toEqual({});
    });
    it('should set defaultView', () => {
      expect(component.defaultView).toEqual('agendaDay');
    });
  });

  describe('ngOnInit', () => {
    it('should set calendarOptions', () => {
      component.ngOnInit();
      expect(component.calendarOptions).toBeDefined();
    });
  });

  describe('refreshViewData', () => {
    it('when loadData is defined should set header', () => {
      const mockView = {
        intervalEnd: moment(),
        intervalStart: moment()
      };

      component.ucCalendar = {
        fullCalendar: () => mockView
      } as NgFullCalendarComponent;
      const emitSpy = spyOn(component.loadData, 'emit');
      component.refreshViewData();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('clickButton', () => {
    it('should remove all object from references', () => {
      component.clickButton();
      expect(component.references).toEqual([]);
    });
  });

  describe('eventClick', () => {
    it('should call emit on eventClickCallback with detail event id', () => {
      const expectedEventId = 'some event id';
      const event = { detail: { event: { id: expectedEventId } } };
      const emitSpy = spyOn(component.eventClickCallback, 'emit');

      component.eventClick(event);

      expect(emitSpy).toHaveBeenCalledWith(expectedEventId);
    });
  });

  describe('eventDrop', () => {
    it('should call emit on eventDropCallback with event', () => {
      const event = { detail: { event: { start: moment(), end: moment() } } };
      const emitSpy = spyOn(component.eventDropCallback, 'emit');

      component.eventDrop(event);

      expect(emitSpy).toHaveBeenCalledWith(event);
    });
  });

  describe('drop', () => {
    it('should call emit on dropCallback with event', () => {
      const event = { detail: { event: { start: moment(), end: moment() } } };
      const emitSpy = spyOn(component.dropCallback, 'emit');

      component.drop(event);

      expect(emitSpy).toHaveBeenCalledWith(event);
    });
  });

  describe('eventMouseOver', () => {
    it('should call emit on eventMouseOverCallback with event', () => {
      const event = { detail: { event: { start: moment(), end: moment() } } };
      const emitSpy = spyOn(component.eventMouseOverCallback, 'emit');

      component.eventMouseOver(event);

      expect(emitSpy).toHaveBeenCalledWith(event);
    });
  });

  describe('eventResize', () => {
    it('should call emit on eventResize with event', () => {
      const event = { detail: { event: { start: moment(), end: moment() } } };
      const emitSpy = spyOn(component.eventResizeCallback, 'emit');

      component.eventResize(event);

      expect(emitSpy).toHaveBeenCalledWith(event);
    });
  });
});

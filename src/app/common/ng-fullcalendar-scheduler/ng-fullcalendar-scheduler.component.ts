import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';
// import 'fullcalendar';
// import 'fullcalendar-scheduler';

@Component({
  selector: 'app-ng-fullcalendar-scheduler',
  template: '',
  // styleUrls: ['./ng-scheduler.component.scss']
})
export class NgFullcalendarSchedulerComponent implements OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked  {

  constructor(private element: ElementRef, private zone: NgZone) { }

  ngOnInit() {
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewChecked(): void {
  }

  ngAfterViewInit(): void {
  }

}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTableComponent } from './session-table.component';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule, MatGridListModule,
  MatIconModule, MatInputModule,
  MatListModule, MatNativeDateModule, MatTableModule,
  MatToolbarModule
} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('SessionTableComponent', () => {
  let component: SessionTableComponent;
  let fixture: ComponentFixture<SessionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionTableComponent,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule,
        MatListModule,
        BrowserAnimationsModule,
        FormsModule,
        MatTableModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

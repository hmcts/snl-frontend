import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingNoteListComponent } from './listing-note-list.component';

describe('ListingNoteListComponent', () => {
  let component: ListingNoteListComponent;
  let fixture: ComponentFixture<ListingNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingNoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

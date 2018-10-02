import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingNoteListComponent } from './listing-note-list.component';
import { Component, Input } from '@angular/core';
import { ListingCreateNotesConfiguration } from '../../models/listing-create-notes-configuration.model';
import { NotesPreparerService } from '../../../notes/services/notes-preparer.service';

@Component({
    selector: 'app-note-list',
    template: '<p>Mock Product Settings Component</p>'
})
class MockNoteListComponent {
  @Input() notes;
  @Input() disabled;
}

describe('ListingNoteListComponent', () => {
  let component: ListingNoteListComponent;
  let fixture: ComponentFixture<ListingNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
        ],
      declarations: [MockNoteListComponent, ListingNoteListComponent ],
        providers: [ListingCreateNotesConfiguration, NotesPreparerService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingNoteListComponent);
    component = fixture.componentInstance;
    component.notes = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

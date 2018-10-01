import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukInputComponent } from './govuk-input.component';
import { FormsModule } from '@angular/forms';

describe('GovukInputComponent', () => {
  let component: GovukInputComponent;
  let fixture: ComponentFixture<GovukInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovukInputComponent ],
        imports: [ FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovukInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

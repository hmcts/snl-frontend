import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTableComponent } from './session-table.component';
import { Store, StoreModule } from '@ngrx/store';
import { sessionReducer } from '../../reducers/session.reducer';
import { AppState } from '../../../app.state';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { AppConfig } from '../../../app.config';
import { HttpClientModule } from '@angular/common/http';

describe('SessionTableComponent', () => {
  let component: SessionTableComponent;
  let fixture: ComponentFixture<SessionTableComponent>;
  let store: Store<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularMaterialModule,
        StoreModule.forRoot( { sessionsReducer: sessionReducer} ),
        HttpClientModule
      ],
      declarations: [
        SessionTableComponent
      ],
      providers: [ AppConfig ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(SessionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsPageComponent } from './sessions-page.component';
import {SessionTableComponent} from '../session-table/session-table.component';
import {FormsModule} from '@angular/forms';
import {Store, StoreModule} from '@ngrx/store';
import {sessionReducer} from '../../reducers/session.reducer';
import {AppState} from '../../../app.state';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularMaterialModule} from '../../../../angular-material/angular-material.module';
import {HttpClientModule} from '@angular/common/http';
import {AppConfig} from '../../../app.config';

describe('SessionsPageComponent', () => {
  let component: SessionsPageComponent;
  let fixture: ComponentFixture<SessionsPageComponent>;
  let store: Store<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        AngularMaterialModule,
        FormsModule,
        StoreModule.forRoot( { sessionsReducer: sessionReducer } ),
        HttpClientModule
      ],
      declarations: [
        SessionsPageComponent,
        SessionTableComponent
      ],
      providers: [
          AppConfig
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(SessionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

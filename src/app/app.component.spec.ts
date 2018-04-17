import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SessionsPageComponent } from './sessions/containers/sessions-page/sessions-page.component';
import { SessionTableComponent } from './sessions/containers/session-table/session-table.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        AngularMaterialModule
      ],
      declarations: [
        AppComponent,
        SessionsPageComponent,
        SessionTableComponent
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should be on sessions view`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app.chosenView).toEqual('main');
  }));
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import { SessionsCreateFormComponent } from './sessions-create-form.component';

let fixture: ComponentFixture<SessionsCreateFormComponent>;
let component: SessionsCreateFormComponent;

fdescribe('SessionsCreateFormComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AngularMaterialModule, FormsModule],
            declarations: [SessionsCreateFormComponent]
        });
        fixture = TestBed.createComponent(SessionsCreateFormComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    describe('create session', () => {
        it('should generate unique session id on subsequent creations', () => {
            let spy = spyOn(component.createSessionAction, 'emit').and.callThrough();

            // @ts-ignore: saveArgumentsByValue not existent in jasmine-types but still works and exists in documentation:
            // https://jasmine.github.io/api/2.8/Spy_calls.html
            spy.calls.saveArgumentsByValue();
            component.create();
            component.create();

            let firstSession = spy.calls.argsFor(0)[0];
            let secondSession = spy.calls.argsFor(1)[0];

            expect(firstSession.id).toBeDefined();
            expect(secondSession.id).toBeDefined();
            expect(firstSession.id).not.toEqual(secondSession.id);
        });

    });
});

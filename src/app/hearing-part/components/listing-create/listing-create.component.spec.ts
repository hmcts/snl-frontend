import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../../angular-material/angular-material.module';
import * as moment from 'moment';
import { ListingCreateComponent } from './listing-create.component';
import * as reducersFromHearingParts from '../../reducers';
import { Store, StoreModule } from '@ngrx/store';
import { Priority } from '../../models/priority-model';
import { CreateListingRequest } from '../../actions/hearing-part.action';

let fixture: ComponentFixture<ListingCreateComponent>;
let component: ListingCreateComponent;
let store: Store<reducersFromHearingParts.State>;

fdescribe('ListingCreateComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AngularMaterialModule, FormsModule,
                StoreModule.forRoot({}),
                StoreModule.forFeature('hearingParts', reducersFromHearingParts.reducers)
            ],
            declarations: [ListingCreateComponent]
        });
        fixture = TestBed.createComponent(ListingCreateComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store)
    });

    it('Should create', () => {
        expect(component).toBeDefined();
    });

    describe('Initial state ', () => {
        it('should include priority', () => {
            expect(component.errors).toBeUndefined();
            expect(component.listing).toBeDefined();
            expect(component.listing.priority).toBe(Priority.Low);
        });
    });

    describe('Creating the Hearing-part ', () => {
        it('should fail and update error when start date is before end date', () => {
            component.create();

            expect(component.errors).not.toBe('');
            expect(component.listing).toBeDefined();
            expect(component.listing.id).not.toBeUndefined();
            expect(component.success).toBe(false);
        });

        it('should succeed and when start date is after end date', () => {
            const spyStore = spyOn(store, 'dispatch').and.stub();

            const now = moment(moment.now());
            component.listing.scheduleStart = now;
            component.listing.scheduleEnd = now.add(1, 'day');
            component.create();

            const passedObj = spyStore.calls.argsFor(0)[0];
            expect(passedObj instanceof CreateListingRequest).toBeTruthy();
            expect(component.errors).toBe('');
            expect(component.listing).toBeDefined();
            expect(component.success).toBe(true);
        });
    });

});

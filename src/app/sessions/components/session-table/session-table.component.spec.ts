import { SessionTableComponent } from './session-table.component';

let component: SessionTableComponent;

describe('SessionTableComponent', () => {
    beforeEach(() => {
        component = new SessionTableComponent();
        console.log(component.sessions);
    });

    describe('Implementation check of sortingDataAccessor on displayedColumns to sort with proper data ', () => {
        it(' tested columns should equal component displayedColumns field', () => {
        });
    });
});

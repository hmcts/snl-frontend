import { AmendScheduledListingComponent } from './amend-scheduled-listing.component';
import { AmendScheduledListingData } from '../../models/amend-scheduled-listing';

let component: AmendScheduledListingComponent;

let dialogMock: any;
let amendData: AmendScheduledListingData;
describe('AmendScheduledListingComponent', () => {

    beforeEach(() => {
        dialogMock = jasmine.createSpyObj('dialog', ['close']);
        amendData = {
            startTime: '12:00'
        };
        component = new AmendScheduledListingComponent(dialogMock, amendData);
    });

    it('Amendment form is initialized with input data ', () => {
        expect(component.amendFormGroup.controls['startTime'].value).toEqual(amendData.startTime)
    });

    it('Amend returns default data if no changes were done', () => {
        component.amend();
        expect(component.dialogRef.close).toHaveBeenCalledWith(amendData);
    });

    it('Amend returns new data if some changes were done', () => {
        let newAmendData: AmendScheduledListingData = {
            ...amendData,
            startTime: '08:30'
        };

        component.amendData = newAmendData;
        component.amend();

        expect(component.dialogRef.close).toHaveBeenCalledWith(newAmendData);
    });
});

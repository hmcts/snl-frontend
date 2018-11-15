import { ListingCreate } from '../../models/listing-create';
import { CaseType } from '../../../core/reference/models/case-type';
import { HearingType } from '../../../core/reference/models/hearing-type';
import { MatSelectChange } from '@angular/material';
import moment = require('moment');
import { ListingRequestEditComponent, ListingTypeTab } from './listing-update.component';
import { DurationAsDaysPipe } from '../../../core/pipes/duration-as-days.pipe';

let component: ListingRequestEditComponent;

const now = moment();
const stubHearingTypes1: HearingType[] = [{code: 'hearing-type-code', description: 'hearing-type'}];
const stubHearingTypes2: HearingType[] = [{code: 'hearing-type-code2', description: 'hearing-type2'}];
const caseTypeWht1 = {code: 'case-type-code1', description: 'case-type1', hearingTypes: stubHearingTypes1} as CaseType;
const caseTypeWht2 = {code: 'case-type-code2', description: 'case-type1', hearingTypes: stubHearingTypes2} as CaseType;
const listingCreate = {
    hearing: {
        id: undefined,
        session: undefined,
        caseNumber: 'number',
        caseTitle: 'title',
        caseTypeCode: caseTypeWht1.code,
        hearingTypeCode: stubHearingTypes1[0].code,
        duration: moment.duration(30, 'minute'),
        scheduleStart: now,
        scheduleEnd: now,
        createdAt: now,
        version: 0,
        priority: undefined,
        reservedJudgeId: undefined,
        communicationFacilitator: undefined,
        userTransactionId: 'uti',
        numberOfSessions: 1,
        multiSession: false
    },
    notes: [],
    userTransactionId: undefined
} as ListingCreate;

describe('ListingUpdateComponent', () => {
    beforeEach(() => {
        component = new ListingRequestEditComponent(new DurationAsDaysPipe())
        component.data = listingCreate;
    });

    it('on creation', () => {
        expect(component.listingRequestFormGroup).toBeDefined();
        expect(component.communicationFacilitators).toBeDefined();
        expect(component.priorityValues).toBeDefined();
        expect(component.hearings).toBeDefined();
        expect(component.noteViewModels).toBeDefined();
        expect(component.judges).toBeDefined();
        expect(component.chosenListingType).toEqual(ListingTypeTab.Single);

    })

    it('update duration', () => {
        component.updateDuration(1, 'day');

        expect(component.listing.hearing.duration).toEqual(moment.duration(1, 'day'))
    })

    it('save', () => {
        component.onSave = jasmine.createSpyObj('onSave', ['emit']);
        spyOn(component.notesComponent, 'prepareNotes').and.returnValue([])

        component.save();

        expect(component.listing.hearing.numberOfSessions).toEqual(1);
        expect(component.notesComponent.prepareNotes).toHaveBeenCalled();
    })

    describe('onCaseTypeChanged', () => {
        beforeEach(() => {
            component.caseTypes = [caseTypeWht1, caseTypeWht2];
        });

        it('should set hearings to caseType associated hearing types', () => {
            component.onCaseTypeChanged(new MatSelectChange(null, caseTypeWht2.code));
            expect(component.hearings).toBe(stubHearingTypes2);

            component.onCaseTypeChanged(new MatSelectChange(null, caseTypeWht1.code));
            expect(component.hearings).toBe(stubHearingTypes1);
        });

        it('empty value should set hearings to empty array', () => {
            component.onCaseTypeChanged(new MatSelectChange(null, null));
            expect(component.hearings).toEqual([]);

            component.onCaseTypeChanged(new MatSelectChange(null, undefined));
            expect(component.hearings).toEqual([]);
        });
    });
});

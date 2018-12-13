import { ActivitiesLogComponent } from './activities-log.component';
import { DEFAULT_ACTIVITY_LOG } from '../models/activity-log.model';
import { Observable } from 'rxjs';

let mockedActivityLogService = jasmine.createSpyObj('activityLogService', ['getActivitiesForEntity']);

let component: ActivitiesLogComponent;
const ENTITY_ID = '123';

describe('ActivitiesLogComponent', () => {
    beforeEach(() => {
        mockedActivityLogService = {...mockedActivityLogService, activityLogs: Observable.of({[ENTITY_ID]: [DEFAULT_ACTIVITY_LOG]})};

        component = new ActivitiesLogComponent(mockedActivityLogService);
        component.entityId = ENTITY_ID;
    });

    describe('onInit', () => {
        it('should initialize activities from service', () => {
            component.ngOnInit();
            expect(component.activities.length).toEqual(1);
            expect(component.activities[0]).toEqual(DEFAULT_ACTIVITY_LOG);
        })
    })
})

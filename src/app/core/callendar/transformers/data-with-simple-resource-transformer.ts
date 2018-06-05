import { IcalendarTransformer } from './icalendar-transformer';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { DefaultDataTransformer } from './default-data-transformer';

export class DataWithSimpleResourceTransformer implements IcalendarTransformer<SessionViewModel> {
    private _defaultTransformer: DefaultDataTransformer;

    constructor(private eventResourceField: string) {
        this._defaultTransformer = new DefaultDataTransformer();
    }

    transform(session: SessionViewModel) {
        let resource = this._defaultTransformer.transform(session);
        let resourceId = 'empty';
        if (this.eventResourceField && session[this.eventResourceField]) {
            resourceId = session[this.eventResourceField].id;
        }
        resource['resourceId'] = resourceId;
        return resource;
    }

}

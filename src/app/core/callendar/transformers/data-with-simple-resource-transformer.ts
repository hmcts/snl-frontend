import { IcalendarTransformer } from './icalendar-transformer';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
import { DefaultDataTransformer } from './default-data-transformer';

export const Separator = ':-:';

export class DataWithSimpleResourceTransformer implements IcalendarTransformer<SessionViewModel> {
    private readonly _defaultTransformer: DefaultDataTransformer;

    constructor(private readonly eventResourceField: string) {
        this._defaultTransformer = new DefaultDataTransformer();
    }

    transform(session: SessionViewModel) {
        let resource = this._defaultTransformer.transform(session); // NOSONAR not const

        let resourceId = this.eventResourceField + Separator + 'empty';
        if (this.eventResourceField && session[this.eventResourceField]) {
            resourceId = `${this.eventResourceField}${Separator}${session[this.eventResourceField].id}`;
        }
        resource['resourceId'] = resourceId;
        return resource;
    }

}

import { EventObjectInput, View } from 'fullcalendar';
import * as moment from 'moment'

export class UpdateEventModel<T = any> {
    event: EventObjectInput & T;
    delta: moment.Duration;
    revertFunc: Function;
    jsEvent: Event;
    ui: any;
    view: View;
}

import { Moment } from 'moment';

export interface EventDrop {
    date: Moment,
    jsEvent: JQuery.Event<HTMLElement>,
    ui: any,
    resourceId?: any
}

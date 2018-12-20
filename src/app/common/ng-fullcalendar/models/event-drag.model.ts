import { View } from 'fullcalendar';

export interface EventDrag<T = any> {
    event: T,
    jsEvent: JQuery.Event<HTMLElement>,
    ui: any,
    view: View
}

import { EventObjectInput, View } from 'fullcalendar';

export interface CalendarMouseEvent {
    event: EventObjectInput;
    jsEvent: MouseEvent;
    view: View
}

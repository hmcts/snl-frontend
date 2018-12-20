import { UpdateEventModel } from '../../common/ng-fullcalendar/models/updateEventModel';
import { SessionCalendarViewModel } from '../../sessions/models/session.viewmodel';
import { EventDrag } from '../../common/ng-fullcalendar/models/event-drag.model';

export type CalendarEventSessionViewModel = CustomEvent<UpdateEventModel<SessionCalendarViewModel>>
export type EventDragSessionCalendarViewModel = CustomEvent<EventDrag<SessionCalendarViewModel>>

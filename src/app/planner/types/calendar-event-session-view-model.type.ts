import { UpdateEventModel } from '../../common/ng-fullcalendar/models/updateEventModel';
import { SessionCalendarViewModel } from '../../sessions/models/session.viewmodel';

export type CalendarEventSessionViewModel = CustomEvent<UpdateEventModel<SessionCalendarViewModel>>

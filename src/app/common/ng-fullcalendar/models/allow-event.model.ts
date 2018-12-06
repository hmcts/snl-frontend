import { DropInfo } from 'fullcalendar/src/types/input-types';

export class AllowEvent<T = any> {
    dropInfo: DropInfo
    darggedEvent: Event & T
}

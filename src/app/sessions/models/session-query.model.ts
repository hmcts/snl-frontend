import * as moment from 'moment'

export interface SessionQuery {
  date: moment.Moment;
}

export interface SessionQueryForDates {
    startDate: moment.Moment;
    endDate: moment.Moment;
}

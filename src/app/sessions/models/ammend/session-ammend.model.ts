
import * as moment from 'moment'
export interface SessionAmmend {
    id: string,
    userTransactionId: string,
    durationInSeconds: number,
    startTime: moment.Moment,
    sessionTypeCode: string,
    version: number
}

import moment = require('moment');

export class DateTimeHelper {

    static generateRandomTimeDuringWorkHours(day: moment.Moment): moment.Moment {
        const min = 9;
        const max = 16;
        const hour = Math.floor(Math.random() * (max - min) + min);

        return day.hour(hour).minute(0);
    }
}

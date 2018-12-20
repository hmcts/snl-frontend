import * as moment from 'moment';

export function setTime(date: moment.Moment, time: string): moment.Moment {

    if (date === null) {
        throw new Error('Expected instance of Moment null given.');
    }

    if (time === null || !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
        throw new Error(`Expected string in format hh:mm '${time}' given.`);
    }

    const dateTime = moment(time, 'HH:mm');

    return moment(date).hours(dateTime.hours()).minutes(dateTime.minutes()).seconds(0).milliseconds(0);
}

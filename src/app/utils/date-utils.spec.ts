import * as dateUtils from './date-utils';
import moment = require('moment');

describe('DateUtils', () => {
    describe('isDateRangeValid', () => {
        it('should validate date range properly', () => {
            const start = moment().startOf('day');
            const end = moment().endOf('day');

            expect(dateUtils.isDateRangeValid(start, end)).toBeTruthy();
        });

        it('should return false when start date is after than end date', () => {
            const start = moment().startOf('day');
            const end = moment().endOf('day');

            expect(dateUtils.isDateRangeValid(end, start)).toBeFalsy();
        });

        it('should return true when start date is undefined', () => {
            const end = moment().endOf('day');

            expect(dateUtils.isDateRangeValid(null, end)).toBeTruthy();
        });

        it('should return true when end date is undefined', () => {
            const start = moment().startOf('day');

            expect(dateUtils.isDateRangeValid(start, null)).toBeTruthy();
        });
    });

    describe('getHttpFriendly', () => {
        it('should format date properly', () => {
            const momentDate = moment('2013-03-01', 'YYYY-MM-DD');

            expect(dateUtils.getHttpFriendly(momentDate)).toEqual('01-03-2013');
        });
    });

    describe('formatDuration', () => {
        it('should format properly for duration > 1D', () => {
            const momentDuration = moment.duration(3, 'days');

            expect(dateUtils.formatDuration(momentDuration)).toEqual('3 D');
        });

        it('should format properly for duration > 24h', () => {
            const momentDuration = moment.duration(1523, 'minutes'); // a day and a bit

            expect(dateUtils.formatDuration(momentDuration)).toEqual('1.5 D');
        });

        it('should format properly for duration == 24h', () => {
            const momentDuration = moment.duration(1440, 'minutes');

            expect(dateUtils.formatDuration(momentDuration)).toEqual('1 D');
        });

        it('should format properly for duration < 24h', () => {
            const momentDuration = moment.duration(1439, 'minutes');

            expect(dateUtils.formatDuration(momentDuration)).toEqual('23:59');
        });
    });

    describe('formatStartTime', () => {
        it('should display time from dateTime', () => {
            const momentDate = moment.utc('2018-10-19 16:32:00+00');

            expect(dateUtils.formatStartTime(momentDate)).toEqual('16:32');
        });
    });
});

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

            expect(dateUtils.isDateRangeValid(undefined, end)).toBeTruthy();
        });

        it('should return true when end date is undefined', () => {
            const start = moment().startOf('day');

            expect(dateUtils.isDateRangeValid(start, undefined)).toBeTruthy();
        });
    });

    describe('getHttpFriendly', () => {
        it('should format date properly', () => {
            const momentDate = moment('2013-03-01', 'YYYY-MM-DD');

            expect(dateUtils.getHttpFriendly(momentDate)).toEqual('01-03-2013');
        })
    })
});
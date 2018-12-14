import { setTime } from './moment-utils';
import * as moment from 'moment';

describe('setTime', () => {

    beforeAll(() => {
        jasmine.addCustomEqualityTester(customMomentEqual);
    });

    describe('throws error when', () => {
        it('date is null', () => {
            expect((() => setTime(null, '10:10'))).toThrowError('Expected instance of Moment null given.');
        });

        it('time is null', () => {
            expect((() => setTime(moment(), null))).toThrowError('Expected string in format hh:mm \'null\' given.');
        });

        it('time is empty string', () => {
            expect((() => setTime(moment(), ''))).toThrowError('Expected string in format hh:mm \'\' given.');
        });

        it('time is in invalid format', () => {
            expect((() => setTime(moment(), '1010'))).toThrowError('Expected string in format hh:mm \'1010\' given.');
            expect((() => setTime(moment(), '10:11230'))).toThrowError('Expected string in format hh:mm \'10:11230\' given.');
            expect((() => setTime(moment(), '10:1'))).toThrowError('Expected string in format hh:mm \'10:1\' given.');
            expect((() => setTime(moment(), '1:10'))).toThrowError('Expected string in format hh:mm \'10:1\' given.');
            expect((() => setTime(moment(), 'ten past twelve'))).toThrowError('Expected string in format hh:mm \'ten past twelve\' given.');
            expect((() => setTime(moment(), '@#$@#%!@#'))).toThrowError('Expected string in format hh:mm \'@#$@#%!@#\' given.');
        });
    });

    it('should return valid time for today', () => {
        const now = moment();
        const expected = moment(now).hours(10).minutes(11).seconds(0).milliseconds(0);

         expect(setTime(now, '10:11')).toEqual(expected);
    });

    it('should return valid time for different day', () => {
        const input = moment().date(20).month(2).year(2000);
        const expected = moment('20/3/2000 09:45', 'DD/MM/YYYY HH:mm');

        expect(setTime(input, '09:45')).toEqual(expected);
    });
});

function customMomentEqual(left: moment.Moment, right: moment.Moment): boolean {
    if (left === null && right === null) {
        return true;
    }

    if (left === null || right === null) {
        return false;
    }

    return left.toDate().valueOf() === right.toDate().valueOf();
}

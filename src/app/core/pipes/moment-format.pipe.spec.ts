import { MomentFormatPipe } from './moment-format.pipe';
import moment = require('moment');

describe('MomentFormatPipe', () => {
    let date: moment.Moment;
    let pipe: MomentFormatPipe;

    beforeEach(() => {
        date = moment('2017/02/01 12:45', 'YYYY/MM/DD HH:mm')
        pipe = new MomentFormatPipe();
    });

    it('uses default format if undefined is given', () => {
        expect(pipe.transform(date, undefined)).toEqual('01/02/2017');
    });

    it('uses the given format', () => {
        expect(pipe.transform(date, 'HH:mm')).toEqual('12:45');
    });
});

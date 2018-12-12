import { leadingZeros } from './leading-zeros';

describe('leading-zeros', () => {

    it('adds zeros to 0', () => {
        expect(leadingZeros(0, 3)).toEqual('000');
    });

    it('adds 1 zero to number', () => {
        expect(leadingZeros(10, 3)).toEqual('010');
    });

    it('adds 2 zeros to number', () => {
        expect(leadingZeros(10, 4)).toEqual('0010');
    });

    it('does not add any zeros to number', () => {
        expect(leadingZeros(10, 2)).toEqual('10');
        expect(leadingZeros(10, 1)).toEqual('10');
    });

});

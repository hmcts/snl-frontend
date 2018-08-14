import { asArray } from './array-utils';

describe('asArray', () => {
  it('should extract values from hash map', () => {
    const value = { id: 'id123', value: 'some value' }
    const hashMap = { id123: value };
    expect(asArray(hashMap)).toEqual([value]);
  });

  it('when get empty object should return empty array', () => {
    expect(asArray({})).toEqual([]);
  });
});

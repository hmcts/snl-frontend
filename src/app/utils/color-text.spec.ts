import { textToColor } from './color-text';

describe('asArray', () => {
  it('should calculate different colors for different text', () => {
    const color1 = textToColor('this is 1');
    const color2 = textToColor('this is different one');
    expect(color1).not.toEqual(color2);
  });

  it('should calculate color for an empty string', () => {
    expect(textToColor('')).not.toBeNull();
  });
});

import * as djb2 from 'djb2';

export function textToColor(text) {
    let hash = djb2(text);

    // tslint:disable-next-line
    let g = (hash & 0xFF0000) >> 16;
    // tslint:disable-next-line
    let b = (hash & 0x00FF00) >> 8;
    // tslint:disable-next-line
    let r = hash & 0x0000FF;

    return '#' + ('0' + r.toString(16)).substr(-2) + ('0' + g.toString(16)).substr(-2) + ('0' + b.toString(16)).substr(-2);
}

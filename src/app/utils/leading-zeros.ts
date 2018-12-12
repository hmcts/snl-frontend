export function leadingZeros(value: number, length: number) {
    let stringValue = '' + value;

    while (stringValue.length < length) {
        stringValue = `0${stringValue}`;
    }

    return stringValue;
}

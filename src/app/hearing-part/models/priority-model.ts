export enum Priority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export function priorityValue(item: Priority) {
    switch (item) {
        case Priority.Low:
            return 0;
        case Priority.Medium:
            return 1;
        case Priority.High:
            return 2;
    }
    return null;
}

export function fromNumber(priorityNumericValue: number): Priority {
    switch (priorityNumericValue) {
        case 0:
            return Priority.Low;
        case 1:
            return Priority.Medium;
        case 2:
            return Priority.High;
        default:
            throw new Error('No Priority value was found for the given integer: ' + priorityNumericValue)
    }
    return null;
}

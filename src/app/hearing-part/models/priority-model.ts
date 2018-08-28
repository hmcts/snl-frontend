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


export function isDateRangeValid(start: Date, end: Date): boolean {
    return (
           (start === null && end !== null)
        || (start !== null && end === null)
        || (start !== null
            && end !== null
            && start.getDate() > end.getDate())
    );
}

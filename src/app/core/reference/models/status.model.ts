export enum Status {
    Listed = 'Listed',
    Unlisted = 'Unlisted',
    Adjourned = 'Adjourned',
    Withdrawn = 'Withdrawn',
    Vacated = 'Vacated'
}

export function fromString(value: string): Status {
    const status = Status[value];
    if (status === undefined) {
        throw new Error(`Cannot create enum from string: '${value}' `)
    } else {
        return status;
    }
}

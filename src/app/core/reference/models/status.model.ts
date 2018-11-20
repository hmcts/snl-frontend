export enum Status {
    Listed = 'Listed',
    Unlisted = 'Unlisted',
    Withdrawn = 'Withdrawn',
    Vacated = 'Vacated',
    Adjourned = 'Adjourned'
}

export function fromString(value: string): Status {
    const status = Status[value];
    if (status === undefined) {
        throw new Error(`Cannot create enum from string: '${value}' `)
    } else {
        return status;
    }
}

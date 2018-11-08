export enum Status {
    Listed = 'Listed',
    Unlisted = 'Unlisted'
}

export function fromString(value: string): Status {
    const status = Status[value];
    if (status === undefined) {
        throw new Error(`Cannot create enum from string: '${value}' `)
    } else {
        return status;
    }
}

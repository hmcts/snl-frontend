
export function getLocalStorage(): Storage {
    return (typeof window !== 'undefined') ? localStorage : null;
}

export function getLocalStorageWrapper(): StorageWrapper {
    return new StorageWrapper(getLocalStorage());
}

export class StorageWrapper {
    constructor(public localStorage: Storage) {}

    public setObject(key:string, object: any): void {
        this.localStorage.setItem(key, JSON.stringify(object))
    }

    public getObject(key:string): any {
        return JSON.parse(this.localStorage.getItem(key));
    }
}

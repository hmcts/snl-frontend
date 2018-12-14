import { Injectable } from '@angular/core';
import { IStorage } from './i-storage.interface';

@Injectable()
export class InMemoryStorageService implements IStorage {

    private storage: Map<string, any> = new Map();

    constructor() {}

    public setObject<T>(key:string, object: T): void {
        this.storage.set(key, object);
    }

    public getObject<T>(key: string): T {
        return this.storage.get(key);
    }
}

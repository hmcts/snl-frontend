export interface IStorage {
    getObject<T>(key: string): T
    setObject<T>(key: string, value: T): void
}

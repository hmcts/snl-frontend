import { Separator } from '../transformers/data-with-simple-resource-transformer';

export class ResourceList {

    private _list: ResourceColumn[] = []; // NOSONAR not readonly

    constructor(resource: string) {
        this.add(`${resource}${Separator}empty`, 'Not allocated');
    }

    add(id: string, title: string) {
        this._list.push({ id, title });
    }

    get(): ResourceColumn[] {
        return Object.assign([], this._list);
    }
}

interface ResourceColumn {
    id: string,
    title: string
}

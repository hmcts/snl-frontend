export class ResourceList {

    private _list: ResourceColumn[] = [];

    constructor() {
        this.add('empty', 'Not allocated');
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

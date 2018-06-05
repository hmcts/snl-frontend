export class ResourceList {

    private _list: { 'id', 'title' }[] = [];

    constructor() {
        this.add('empty', 'Not allocated');
    }

    add(id: string, title: string) {
        this._list.push({ 'id': id, 'title': title });
    }

    get(): { 'id', 'title' }[] {
        return Object.assign([], this._list);
    }
}

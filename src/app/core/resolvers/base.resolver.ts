import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { mergeMap, take } from 'rxjs/operators';

@Injectable()
export class BaseResolver {

    constructor() {}

    getOrFetchData(dataFetchingFunction: () => Observable<any[]>, dataGettingFunction: () => Observable<any[]>): Observable<any[]> {
        return dataGettingFunction().pipe(mergeMap(data => {
            return data.length !== 0 ? Observable.of(data) : dataFetchingFunction();
        }), take(1))
    }
}

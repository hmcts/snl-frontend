import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { mergeMap, take } from 'rxjs/operators';

@Injectable()
export class BaseResolver {

    constructor() {}

    getOrFetchData(dataFetchingFunction: () => Observable<any[]>, dataGettingFunction: () => Observable<any[]>): Observable<any[]> {
        return dataGettingFunction().pipe(mergeMap(data => {
            if (data.length !== 0) {
                return Observable.of(data);
            } else {
                return dataFetchingFunction();
            }
        }), take(1))
    }
}

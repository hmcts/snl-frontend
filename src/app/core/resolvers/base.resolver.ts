import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { mergeMap, take } from 'rxjs/operators';

@Injectable()
export class BaseResolver {

    constructor() {}

    getOrFetchData(service: any, dataFetchingFunctionName: string, dataGettingFunctionName: string) {
        return service[dataGettingFunctionName]().pipe(mergeMap(data => {
            if ((data as any[]).length !== 0) {
                return Observable.of(data);
            } else {
                return service[dataFetchingFunctionName]();
            }
        }), take(1))
    }
}

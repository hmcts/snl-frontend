import { Injectable, Injector } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfig {

    static locale = 'en-GB';

    protected config: Config;

    constructor(private readonly injector: Injector) { }

    public load(): Promise<any> {
        console.log('Loading app config...');

        const http = this.injector.get(HttpClient);
        const configUrl = environment.configUrl;

        return new Promise<void>((resolve, reject) => {
          http
            .get(configUrl)
            .subscribe((config: Config) => {
              this.config = config;
              console.log('Loading app config: OK');
              resolve();
            });
        });
    }

    public getApiUrl() {
        return this.config.apiUrl;
    }

    public getNotesUrl() {
        return this.config.notesUrl;
    }

    /**
     * Creates url to call api service, provides hostname and protocol
     * @param suffix - should start '/' and contain the rest of url
     * @returns {string} full url to call the api
     */
    public createApiUrl(suffix) {
        return this.getApiUrl() + suffix;
    }
}

export class Config {
    apiUrl: string;
    notesUrl: string;
}

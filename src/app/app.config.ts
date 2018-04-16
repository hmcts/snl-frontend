import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfig {

  protected config: Config;

  constructor(private http: HttpClient) {}

  public load(): Promise<void> {
    console.log('Loading app config...');

    let configUrl = environment.configUrl;

    return new Promise<void>((resolve, reject) => {
      this.http
        .get(configUrl)
        .subscribe((config: Config) => {
          this.config = config;
          console.log('Loading app config: OK');
          resolve();
        });
    });
  }

  public getApiUrl() {
    return this.config.api_url;
  }
}

export class Config {
  api_url: string;
}

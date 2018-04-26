import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../app.config';

@Injectable()
export class SecurityService {

    private authenticated = false;

    constructor(private http: HttpClient, private config: AppConfig) {
        console.log("SERVICE CREATED")
    }

    authenticate(credentials, callback) {

        const headers = new HttpHeaders(credentials ? {
            authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        } : {});

        this.http.get(this.config.createApiUrl('/security/user'), {headers: headers}).subscribe(response => {
            if (response['principal']) {
                this.authenticated = true;
                console.log("AUTHED PRINCIPAL!")
            } else {
                this.authenticated = false;
                console.log("AUTHED NOT!")

            }
            return callback && callback();
        });

    }

    isAuthenticated() { return this.authenticated; }

    logout(callback) {
        this.http.post(this.config.createApiUrl('/logout'), {}).subscribe(success => {
            this.authenticated = false;
            callback(success);
        });
    }

    getAuthenticatedUser(callback) {
        if (!this.authenticated) { return; }
        this.http.get(this.config.createApiUrl('/security/user')).subscribe(data =>
            callback(data)
        );
    }
}

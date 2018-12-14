import { Injectable } from '@angular/core';
import { AccessToken } from '../models/access-token';
import { SecurityContext } from './security-context.service';
import { AppConfig } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable()
export class SecurityService {

    constructor(private readonly context: SecurityContext,
                private readonly http: HttpClient,
                private readonly config: AppConfig) { // NOSONAR not readonly
    }

    authenticate(credentials, callback) {
        return this.http.post(this.config.createApiUrl('/security/signin'), credentials)
            .subscribe(sigininResponse => {
                const accessToken = new AccessToken(sigininResponse['accessToken'], sigininResponse['tokenType']);
                this.context.setToken(accessToken.getAsHeader().headerToken);
                this.refreshAuthenticatedUserData(callback);
            });
    }

    refreshAuthenticatedUserData(callback = () => {}): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            this.http.get(this.config.createApiUrl('/security/user')).subscribe(response => {
                this.context.parseAuthenticationRespone(response);
                callback();
                resolve();
            });
        });
    }

    async isAuthenticated() {
        if (!this.context.getCurrentUser() || this.context.getCurrentUser() === User.emptyUser()) {
            await this.refreshAuthenticatedUserData();
            return this.context.isAuthenticated();
        } else {
            return this.context.isAuthenticated();
        }
    }

    logout(callback?) {
        return this.context.logout(callback);
    }

    getCurrentUser(): User {
        return this.context.getCurrentUser();
    }
}

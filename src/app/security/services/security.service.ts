import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/user.model';
import { AccessToken, AuthorizationHeaderName } from '../models/access-token';

@Injectable()
export class SecurityService {

    userSubject$: Subject<User> = new Subject();
    currentUser: User = User.emptyUser();

    constructor(private http: HttpClient,
                private config: AppConfig,
                @Inject('STORAGE') private storage: Storage) {
        this.userSubject$.subscribe(user => this.currentUser = user);
    }

    authenticate(credentials, callback) {
        this.http.post(this.config.createApiUrl('/security/signin'), credentials).subscribe(sigininResponse => {
            let accessToken = new AccessToken(sigininResponse['accessToken'], sigininResponse['tokenType']);
            this.storage.setItem(AuthorizationHeaderName, accessToken.getAsHeader().headerToken);
            return this.refreshAuthenticatedUserData(callback);
        });
    }

    isAuthenticated() {
        return this.currentUser.accountNonExpired && this.currentUser.accountNonLocked
            && this.currentUser.credentialsNonExpired && this.currentUser.enabled;
    }

    logout(callback) {
        this.storage.removeItem(AuthorizationHeaderName);
        this.userSubject$.next(User.emptyUser());
        callback();
    }

    refreshAuthenticatedUserData(callback) {
        this.http.get(this.config.createApiUrl('/security/user')).subscribe(response => {
            this.parseAuthenticationRespone(response);
            callback();
        });
    }

    private parseAuthenticationRespone(response) {
        if (response['username']) {
            this.userSubject$.next(Object.assign(new User(), response));
        } else {
            this.userSubject$.next(User.emptyUser());
        }
    }
}

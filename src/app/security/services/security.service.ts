import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/user.model';

@Injectable()
export class SecurityService {

    userSubject$: Subject<User> = new Subject();
    currentUser: User = User.emptyUser();

    constructor(private http: HttpClient, private config: AppConfig) {
        this.userSubject$.subscribe(user => this.currentUser = user);
    }

    authenticate(credentials, callback) {

        const headers = new HttpHeaders(credentials ? {
            authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        } : {});

        this.http.get(this.config.createApiUrl('/security/user'), {headers: headers}).subscribe(response => {
            this.parseAuthenticationRespone(response);
            return callback && callback();
        });
    }

    isAuthenticated() {
        return this.currentUser.accountNonExpired && this.currentUser.accountNonLocked && this.currentUser.credentialsNonExpired;
    }

    logout(callback) {
        this.http.post(this.config.createApiUrl('/logout'), {}).subscribe(success => {
            this.userSubject$.next(User.emptyUser());
            callback(success);
        });
    }

    refreshAuthenticatedUser(callback) {
        if (!this.isAuthenticated) {
            return;
        }
        this.http.get(this.config.createApiUrl('/security/user')).subscribe(response => {
            this.parseAuthenticationRespone(response);
            callback(response);
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

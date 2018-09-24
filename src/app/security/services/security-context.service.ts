import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/user.model';
import { AuthorizationHeaderName } from '../models/access-token';

@Injectable()
export class SecurityContext {

    userSubject$: Subject<User> = new Subject();
    private currentUser: User = User.emptyUser();

    constructor(@Inject('STORAGE') private storage: Storage) { // NOSONAR not readonly
        this.userSubject$.subscribe(user => this.currentUser = user);
    }

    isAuthenticated() {
        return this.currentUser.accountNonExpired && this.currentUser.accountNonLocked
            && this.currentUser.credentialsNonExpired && this.currentUser.enabled;
    }

    logout(callback?) {
        this.storage.removeItem(AuthorizationHeaderName);
        this.userSubject$.next(User.emptyUser());
        if (callback) {
            callback();
        }
    }

    setToken(tokenValue): any {
        this.storage.setItem(AuthorizationHeaderName, tokenValue);
    }

    getToken(): string {
        return this.storage.getItem(AuthorizationHeaderName);
    }

    parseAuthenticationRespone(response) {
        if (response['username']) {
            this.userSubject$.next(Object.assign(new User(), response));
        } else {
            this.userSubject$.next(User.emptyUser());
        }
    }

    getCurrentUser(): User {
        return this.currentUser;
    }
}

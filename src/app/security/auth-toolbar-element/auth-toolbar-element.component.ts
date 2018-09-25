import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityContext } from '../services/security-context.service';

@Component({
    selector: 'app-auth-toolbar-element',
    templateUrl: './auth-toolbar-element.component.html',
    styleUrls: ['./auth-toolbar-element.component.scss']
})
export class AuthToolbarElementComponent implements OnInit {

    loggedInUsername = 'Logged user';

    constructor(private readonly security: SecurityContext, private readonly router: Router) {
    }

    ngOnInit() {
        this.loggedInUsername = this.security.getCurrentUser().username;
        this.security.userSubject$.subscribe(user => {
            this.loggedInUsername = user.username;
        });
    }

    authenticated() {
        return this.security.isAuthenticated();
    }

    logout() {
        this.security.logout(() =>
            this.router.navigateByUrl('/auth')
        );
    }
}

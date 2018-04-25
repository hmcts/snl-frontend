import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from '../services/security.service';

@Component({
    selector: 'app-auth-toolbar-element',
    templateUrl: './auth-toolbar-element.component.html',
    styleUrls: ['./auth-toolbar-element.component.scss']
})
export class AuthToolbarElementComponent implements OnInit {

    loggedInUsername = 'Logged user';

    constructor(private security: SecurityService, private http: HttpClient, private router: Router) {
    }

    ngOnInit() {
        this.security.getAuthenticatedUser(data =>
            this.loggedInUsername = data['principal']['username']
        );
    }

    authenticated() {
        return this.security.isAuthenticated();
    }

    logout() {
        this.security.logout(() =>
            this.router.navigateByUrl('/')
        );
    }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from '../../security/services/security.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    error;

    constructor(private security: SecurityService, private http: HttpClient) {
    }

    ngOnInit() {
    }

    isInRole(roleType: string) {
        return this.security.currentUser.hasRole(roleType);
    }

    authenticated() {
        return this.security.isAuthenticated();
    }
}

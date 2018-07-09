import { Component } from '@angular/core';
import { SecurityService } from '../../security/services/security.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    error;

    constructor(private security: SecurityService) {
    }

    isInRole(roleType: string) {
        return this.security.currentUser.hasRole(roleType);
    }

    authenticated() {
        return this.security.isAuthenticated();
    }
}

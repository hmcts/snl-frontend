import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SecurityService } from './security/services/security.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private security: SecurityService, private http: HttpClient, private router: Router) {
    }

    authenticated() { return this.security.isAuthenticated(); }

    cos() {
        this.http.get('/api/security/cos').subscribe(data => {
            console.log('received: ' + data);
        });
    }
}

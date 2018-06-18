import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/security.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    error;
    credentials = {username: '', password: ''};
    returnUrl: string;

    constructor(private security: SecurityService, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
        this.route.queryParamMap.subscribe(params => {
            this.returnUrl = params.get('returnUrl');
        });
    }

    login() {
        this.security.authenticate(this.credentials, data => {
            // TODO use route.snapsho to go to previously visited component
            if (this.security.currentUser.hasRole('JUDGE')) {
                // TODO find a way to get away from /home just keep /judge
                this.router.navigate(['/home/judge/main']);
            } else if (this.returnUrl) {
                this.router.navigateByUrl(this.returnUrl);
            } else {
                this.router.navigate(['/home']);
            }
        });
        return false;
    }

    ngOnInit(): void {
        this.security.refreshAuthenticatedUserData(response => {
            if (this.security.isAuthenticated() && this.returnUrl) {
                this.router.navigateByUrl(this.returnUrl);
            }
        });
    }
}

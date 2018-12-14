import { Component } from '@angular/core';
import { SecurityService } from '../services/security.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    error;
    credentials = {username: '', password: ''};
    returnUrl: string;

    constructor(private readonly security: SecurityService,
                readonly router: Router,
                private readonly route: ActivatedRoute) {
        this.route.queryParamMap.subscribe(params => {
            this.returnUrl = params.get('returnUrl');
        });
    }

    login() {
        this.security.authenticate(this.credentials, data => {
            // TODO use route.snapsho to go to previously visited component
            if (this.security.getCurrentUser().hasRole('JUDGE')) {
                // TODO find a way to get away from /home just keep /judge
                this.router.navigate(['/home/judge/main']);
            } else if (this.returnUrl) {
                this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
            } else {
                this.router.navigate(['/home']);
            }
        });

        return false;
    }
}

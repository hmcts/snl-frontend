import { Component, Input, OnInit } from '@angular/core';
import { SecurityService } from '../services/security.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    credentials = {username: '', password: ''};

    constructor(private security: SecurityService, private http: HttpClient, private router: Router) {
    }

    login() {
        this.security.authenticate(this.credentials, () => {
            this.router.navigateByUrl('/');
        });
        return false;
    }

}

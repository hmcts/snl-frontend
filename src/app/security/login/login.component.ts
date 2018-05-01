import { Component, Input, OnInit } from '@angular/core';
import { SecurityService } from '../services/security.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    error;
    credentials = {username: '', password: ''};

    constructor(private security: SecurityService, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
        let teraz = new Date();
        let mom = moment('PT1H40M');
        let mix = moment(teraz).add('PT1H40M')
        console.log(teraz)
        console.log(mom.toISOString())
        console.log(mix.toISOString())
    }

    login() {
        this.security.authenticate(this.credentials, () => {
            this.router.navigate(['/home']);
        });
        return false;
    }

}

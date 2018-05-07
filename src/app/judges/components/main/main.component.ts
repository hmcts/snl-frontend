import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../../security/services/security.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    judge = '"Unknown name"';

    constructor(private security: SecurityService) {
    }

    ngOnInit() {
        this.judge = this.security.currentUser.username;
        // TODO do a call to get the full user Name
    }

}

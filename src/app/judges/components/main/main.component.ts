import { Component, OnInit } from '@angular/core';
import { SecurityContext } from '../../../security/services/security-context.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    judge = '"Unknown name"';

    constructor(private readonly securityContext: SecurityContext) {
    }

    ngOnInit() {
        this.judge = this.securityContext.getCurrentUser().username;
        // TODO do a call to get the full user Name
    }

}

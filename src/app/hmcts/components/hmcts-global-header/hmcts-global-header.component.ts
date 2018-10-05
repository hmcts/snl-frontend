import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-hmcts-global-header',
    templateUrl: './hmcts-global-header.component.html',
    styleUrls: ['./hmcts-global-header.component.scss']
})
export class HmctsGlobalHeaderComponent {
    @Input() serviceName = {
        name: 'Service name',
        url: '#'
    };
    @Input() navigation = {
        label: 'Account navigation',
        items: []
    };

    constructor() {
    }

}

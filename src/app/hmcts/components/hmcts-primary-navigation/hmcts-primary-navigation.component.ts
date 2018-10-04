import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-hmcts-primary-navigation',
    templateUrl: './hmcts-primary-navigation.component.html',
    styleUrls: ['./hmcts-primary-navigation.component.scss']
})
export class HmctsPrimaryNavigationComponent {
    @Input() label = 'Primary navigation';
    @Input() items = [];

    selectedNavItem: any = {
        href: '',
        text: ''
    }

    selectNavItem(item) {
        this.selectedNavItem = {...item};
    }

    constructor() { }

}

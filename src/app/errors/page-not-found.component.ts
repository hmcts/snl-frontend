import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent {
    constructor(private location: Location) { }
    goBack(): void {
        this.location.back();
    }
}

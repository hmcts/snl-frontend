import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-govuk-input',
    templateUrl: './govuk-input.component.html',
    styleUrls: ['./govuk-input.component.scss']
})
export class GovukInputComponent {

    @Input() id = '';
    @Input() name = '';
    @Input() hint = {
        text: ''
    };
    @Input() label = {
        text: ''
    };

    @Input() value: string;
    @Output() valueChange: EventEmitter<String> = new EventEmitter<String>();

    constructor() { }

}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GovukButtonComponent} from './components/govuk-button/govuk-button.component';
import {GovukInputComponent} from './components/govuk-input/govuk-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        GovukButtonComponent,
        GovukInputComponent,
    ],
    exports: [
        GovukButtonComponent,
        GovukInputComponent,
    ]
})

export class GovukModule { }

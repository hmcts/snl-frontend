import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { SecurityService } from './services/security.service';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AuthToolbarElementComponent } from './auth-toolbar-element/auth-toolbar-element.component';
import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { AuthPageComponent } from './containers/auth-page/auth-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        AppRoutingModule,
        RouterModule.forChild([{
            path: '',
            component: AuthPageComponent,
            children: [
                { path: '', redirectTo: 'login', pathMatch: 'full' },
                {
                    path: 'login',
                    component: LoginComponent
                }
            ]},
        ]),
    ],
    exports: [AuthToolbarElementComponent],
    declarations: [LoginComponent, AuthToolbarElementComponent],
    providers: [SecurityService]
})
export class SecurityModule {
}

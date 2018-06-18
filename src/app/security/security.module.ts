import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AuthToolbarElementComponent } from './auth-toolbar-element/auth-toolbar-element.component';
import { RouterModule } from '@angular/router';
import { AuthPageComponent } from './containers/auth-page/auth-page.component';
import { AuthGuard } from './guards/auth.guard';
import { getLocalStorage } from '../utils/storage';

export const COMPONENTS = [
    AuthPageComponent,
    LoginComponent,
    AuthToolbarElementComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        RouterModule.forChild([{
            path: '',
            component: AuthPageComponent,
            children: [
                {path: '', redirectTo: 'login', pathMatch: 'full'},
                {
                    path: 'login',
                    component: LoginComponent
                }
            ]
        },
        ])
    ],
    exports: COMPONENTS,
    declarations: COMPONENTS,
    providers: [
        AuthGuard,
        {provide: 'STORAGE', useFactory: getLocalStorage}
    ]
})
export class SecurityModule {
}

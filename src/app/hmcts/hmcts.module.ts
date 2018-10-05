import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HmctsGlobalHeaderComponent } from './components/hmcts-global-header/hmcts-global-header.component';
import { HmctsPrimaryNavigationComponent } from './components/hmcts-primary-navigation/hmcts-primary-navigation.component';
import { HmctsSubNavigationComponent } from './components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        HmctsGlobalHeaderComponent,
        HmctsPrimaryNavigationComponent,
        HmctsSubNavigationComponent
    ],
    exports: [
        HmctsGlobalHeaderComponent,
        HmctsPrimaryNavigationComponent,
        HmctsSubNavigationComponent,
    ]
})
export class HmctsModule {

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewListingComponent } from './components/view-listing/view-listing.component';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ListingService } from './services/listing.service';
import { MatCardModule, MatDividerModule, MatListModule, MatTabsModule } from '@angular/material';

const COMPONENTS = [
	ViewListingComponent
];

@NgModule({
	imports: [
		CommonModule,
		AngularMaterialModule,
		FormsModule,
		MatCardModule,
		MatDividerModule,
		MatTabsModule,
		MatListModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
	providers: [ListingService]
})
export class ListingModule {
}

/*
    RouterModule.forChild([
      {
        path: 'hearing/:id',
        component: ViewListingComponent
      }
    ])
 */
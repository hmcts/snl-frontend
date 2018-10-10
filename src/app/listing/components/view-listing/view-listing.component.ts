import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../services/listing.service';
import { Hearing } from '../../models/listing';

@Component({
	selector: 'app-view-listing',
	templateUrl: './view-listing.component.html',
	styleUrls: ['./view-listing.component.scss']
})
export class ViewListingComponent implements OnInit {
	private hearing: Hearing;

	constructor(private readonly listingService: ListingService) {
	}

	ngOnInit() {
		this.hearing = this.listingService.getById('fake-id');
		this.hearing.caseType;
	}

}

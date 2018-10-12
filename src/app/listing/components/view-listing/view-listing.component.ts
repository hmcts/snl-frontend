import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../services/listing.service';
import { Hearing } from '../../models/listing';

@Component({
  selector: 'app-view-listing',
  templateUrl: './view-listing.component.html',
  styleUrls: ['./view-listing.component.scss']
})
export class ViewListingComponent implements OnInit {
  hearing: Hearing;

  constructor(private readonly listingService: ListingService) {
  }

  ngOnInit() {
    // todo change to ID from URL
    this.listingService.getById('4535afdf-d7fc-4d8e-b682-c20c5fcdaf8a').subscribe(
      (x) => {
        this.hearing = x;
      }
    );
  }

  formatDate(date: string): string {
    return moment(date).format()
  }

}

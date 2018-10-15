import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../services/listing.service';
import { Hearing } from '../../models/listing';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-listing',
  templateUrl: './view-listing.component.html',
  styleUrls: ['./view-listing.component.scss']
})
export class ViewListingComponent implements OnInit {
  hearing: Hearing;

  constructor(
    private route: ActivatedRoute,
    private readonly listingService: ListingService
  ) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')
    this.listingService.getById(id).subscribe(h => {
      this.hearing = h;
    });
  }

  formatDate(date: string): string {
    return moment(date).format()
  }

  formatDuration(duration: number): string {
    return moment.unix(duration).format('HH:mm');
  }
}

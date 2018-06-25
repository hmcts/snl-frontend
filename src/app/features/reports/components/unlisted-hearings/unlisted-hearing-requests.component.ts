import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UnlistedHearingRequest } from '../../model/unlisted-hearing-request';

@Component({
  selector: 'app-unlisted-hearing-requests',
  templateUrl: './unlisted-hearing-requests.component.html',
  styleUrls: ['./unlisted-hearing-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnlistedHearingRequestsComponent implements OnChanges {
    unlistedHearingRequests: UnlistedHearingRequest[];
    @Output() getData = new EventEmitter();

    @Input('unlistedHearingRequests')
    public set setUnlistedHearingRequests(data: UnlistedHearingRequest[]) {
        this.unlistedHearingRequests = data;

        this.dataSource = new MatTableDataSource(this.unlistedHearingRequests);
    }

    dataSource: MatTableDataSource<any>;
    displayedColumns = ['title', 'hearings', 'minutes'];

    constructor() {
        this.loadData();
    }

    ngOnChanges() {
    }

    loadData() {
        this.getData.emit();
    }
}

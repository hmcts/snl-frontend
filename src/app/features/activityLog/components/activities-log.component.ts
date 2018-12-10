import { Component, Input, OnInit } from '@angular/core';
import { ActivityLogService } from '../services/activity-log.service';
import { ActivityLog } from '../models/activity-log.model';

@Component({
    selector: 'app-activities-log',
    templateUrl: './activities-log.component.html',
    styleUrls: ['./activities-log.component.scss']
})
export class ActivitiesLogComponent implements OnInit {
    @Input()
    entityId: string;

    activities: ActivityLog[];

    constructor(private readonly activityLogService: ActivityLogService) {
    }

    ngOnInit() {
        this.fetchActivities();
    }

    public fetchActivities() {
        this.activityLogService.activityLogs
            .subscribe(activityLog => {
                    this.activities = activityLog[this.entityId]
                }
            );
    }
}

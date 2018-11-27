import { AfterViewChecked, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as moment from 'moment'
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';
import { SessionViewModel } from '../../../sessions/models/session.viewmodel';
@Component({
  selector: 'app-draggable-hearing-part',
  templateUrl: './draggable-hearing-part.component.html',
  styleUrls: ['./draggable-hearing-part.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableHearingPartComponent implements AfterViewChecked {
    @Input() session: SessionViewModel;
    @Input() hearingPart: HearingPartViewModel;

    constructor() {
    }

    ngAfterViewChecked() {
        ($('.draggable-hearing') as any).draggable({
            revert: false,
            helper() { return $(this).clone()
                .css('pointer-events', 'none')
                .appendTo('.container')
                .show()
            }
        });
    }

    getDuration() {
        return this.hearingPart.multiSession ? moment.duration(this.session.duration) : this.hearingPart.duration
    }
}

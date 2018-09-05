import { AfterViewChecked, ChangeDetectionStrategy, Component, Input } from '@angular/core';

import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable.js';
import { HearingPartViewModel } from '../../models/hearing-part.viewmodel';
@Component({
  selector: 'app-draggable-hearing-part',
  templateUrl: './draggable-hearing-part.component.html',
  styleUrls: ['./draggable-hearing-part.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableHearingPartComponent implements AfterViewChecked {
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
}

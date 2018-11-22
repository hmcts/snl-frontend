import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HearingActions } from '../models/hearing-actions';
import { DialogWithActionsComponent } from '../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { DEFAULT_DIALOG_CONFIG } from '../../features/transactions/models/default-dialog-confg';
import { HearingService } from './hearing.service';
import { TransactionDialogComponent } from '../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { Hearing } from '../models/hearing';

@Injectable()
export class PossibleActionsService {

    possibleActions = {
        [HearingActions.Unlist]: {
            canBeDone: false,
            operation: () => this.openUnlistDialog(),
            callService: (hearing) => this.hearingService.unlist(hearing),
            summaryText: 'Unlist hearing parts from session'
        },
        [HearingActions.Adjourn]: {
            canBeDone: false,
            operation: () => this.openAdjournDialog(),
            callService: (hearing) => this.hearingService.adjourn(hearing),
            summaryText: 'Adjourn hearing'
        },
        [HearingActions.Withdraw]: {
            canBeDone: false,
            operation: () => this.openWithdrawDialog(),
            callService: (hearing) => this.hearingService.withdraw(hearing),
            summaryText: 'Withdraw hearing '
        }
    };

    constructor(private readonly dialog: MatDialog,
                private readonly hearingService: HearingService) {
    }

    openUnlistDialog() {
        const confirmationDialogRef = this.dialog.open(DialogWithActionsComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: {
                title: 'Unlist hearing',
                message: 'Are you sure you want to unlist this hearing?' +
                    'Once you do this you will need to relist the hearing and all subsequent hearing parts.',
            },
            width: '350px'
        });

        return confirmationDialogRef.afterClosed();
    }

    handleAction(value: HearingActions, hearing: Hearing) {
        // this.mapToHearingPossibleActions(hearing);
        const action = this.possibleActions[value];

        if (action.canBeDone) {
            action.operation().subscribe((confirmed) => {
                this.confirmationDialogClosed(confirmed, () => action.callService(hearing), hearing, action.summaryText)
            });
        }
    }

    public mapToHearingPossibleActions(hearing: Hearing) {
        Object.keys(hearing.possibleActions).forEach(key => {
            this.possibleActions[key].canBeDone = hearing.possibleActions[key]
        })

        return this.possibleActions;
    }

    private confirmationDialogClosed = (confirmed: boolean, callService: () => void, hearing: Hearing, summaryDialogText: string) => {
        if (confirmed) {
            callService();
            this.openSummaryDialog(summaryDialogText).afterClosed().subscribe((success) => {
                if (success) {
                    this.fetchHearing(hearing.id);
                }
            });
        }
    };

    private openSummaryDialog(summaryDialogText: string) {
        return this.dialog.open(TransactionDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: summaryDialogText
        });
    }

    private fetchHearing(id: string) {
        this.hearingService.getById(id);
    }
}

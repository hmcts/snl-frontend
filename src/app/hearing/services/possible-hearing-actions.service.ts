import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HearingActions } from '../models/hearing-actions';
import { DialogWithActionsComponent } from '../../features/notification/components/dialog-with-actions/dialog-with-actions.component';
import { DEFAULT_DIALOG_CONFIG } from '../../features/transactions/models/default-dialog-confg';
import { HearingService } from './hearing.service';
import { TransactionDialogComponent } from '../../features/transactions/components/transaction-dialog/transaction-dialog.component';
import { Hearing } from '../models/hearing';
import { PossibleActionConfig } from '../models/possible-action-config';
import { IPossibleActionConfigs } from '../models/ipossible-actions';
import { Observable } from 'rxjs';
import { AdjournHearingDialogComponent } from '../components/adjourn-hearing-dialog/adjourn-hearing.dialog.component';

@Injectable()
export class PossibleHearingActionsService {

    private readonly possibleActions: IPossibleActionConfigs = {
        [HearingActions.Unlist]: {
            enabled: false,
            openDialog: () => this.openUnlistDialog(),
            callService: (hearing) => this.hearingService.unlist(hearing),
            summaryText: 'Unlist hearing parts from session'
        },
        [HearingActions.Adjourn]: {
            enabled: false,
            openDialog: () => this.openAdjournDialog(),
            callService: (hearing, description) => this.hearingService.adjourn(hearing, description),
            summaryText: 'Adjourn hearing'
        },
        [HearingActions.Withdraw]: {
            enabled: false,
            openDialog: () => this.openWithdrawDialog(),
            callService: (hearing) => this.hearingService.withdraw(hearing),
            summaryText: 'Withdraw hearing '
        },
        [HearingActions.Vacate]: {
            enabled: false,
            openDialog: () => this.openVacateDialog(),
            callService: (hearing) => this.hearingService.vacate(hearing),
            summaryText: 'Vacate hearing'
        }
    };

    constructor(private readonly dialog: MatDialog,
                private readonly hearingService: HearingService) {
    }

    public handleAction(value: HearingActions, hearing: Hearing) {
        const action: PossibleActionConfig = this.possibleActions[value];

        if (action.enabled) {
            action.openDialog().subscribe((dialogData) => {
                this.confirmationDialogClosed(dialogData.confirmed, () => action.callService(hearing, dialogData.description),
                    hearing, action.summaryText)
            });
        }
    }

    public mapToHearingPossibleActions(hearing: Hearing): IPossibleActionConfigs {
        Object.keys(hearing.possibleActions).forEach(key => {
            if (this.possibleActions[key] !== undefined) {
                this.possibleActions[key].enabled = hearing.possibleActions[key]
            }
        })

        return this.possibleActions;
    }

    private openAdjournDialog() { // NOSONAR
        const confirmationDialogRef = this.dialog.open(AdjournHearingDialogComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: {
                title: 'Adjourn hearing',
                message: 'Please add a reason for adjournment in the field below.' +
                    'Once the hearing has been adjourned it cannot be undone.'
            },
            width: '500px'
        });

        return confirmationDialogRef.afterClosed();
    }

    private openUnlistDialog() { // NOSONAR
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

    private openWithdrawDialog(): Observable<any> { // NOSONAR
        const confirmationDialogRef = this.dialog.open(DialogWithActionsComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: {
                title: 'Withdraw hearing',
                message: 'Are you sure you want to withdraw this hearing? ' +
                    'Once the hearing has been withdrawn it cannot be undone.',
            },
            width: '350px'
        });

        return confirmationDialogRef.afterClosed();
    }

    private openVacateDialog(): Observable<any> { // NOSONAR
        const confirmationDialogRef = this.dialog.open(DialogWithActionsComponent, {
            ...DEFAULT_DIALOG_CONFIG,
            data: {
                title: 'Vacate hearing',
                message: 'Are you sure you want to vacate this hearing? ' +
                    'Once the hearing has been vacated it cannot be undone.',
            },
            width: '350px'
        });

        return confirmationDialogRef.afterClosed();
    }

    private confirmationDialogClosed = (confirmed: boolean, callService: () => void, hearing: Hearing, summaryDialogText: string) => {
        if (confirmed) {
            callService();
            this.openSummaryDialog(summaryDialogText).afterClosed().subscribe(() => {
                this.fetchHearing(hearing.id);
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

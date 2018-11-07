import { Injectable } from '@angular/core';
import { ITransactionDialogData } from '../models/transaction-dialog-data.model';
import { TransactionDialogComponent } from '../components/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material';

@Injectable()
export class TransactionService {
    constructor(public dialog: MatDialog) {}

    openTransactionDialog(data: ITransactionDialogData) {
        return this.dialog.open<any, ITransactionDialogData>(TransactionDialogComponent, {
            ...TransactionDialogComponent.DEFAULT_DIALOG_CONFIG,
            data: data
        });
    }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatListModule,
    MatTableModule,
    MatSidenavModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatRadioModule
  ],
  exports: [
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatListModule,
    MatTableModule,
    MatSidenavModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatRadioModule
  ],
  declarations: []
})
export class AngularMaterialModule { }

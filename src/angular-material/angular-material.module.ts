import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatCardModule,
  MatDialogModule,
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
  MatToolbarModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  MatSortModule, MatTabsModule, MatExpansionModule, MatDividerModule
} from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '../../node_modules/@angular/material-moment-adapter';
import { AppConfig } from '../app/app.config';

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
    MatRadioModule,
    MatDialogModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatExpansionModule
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
    MatRadioModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule
  ],
  declarations: [],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: AppConfig.locale},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: {...MAT_MOMENT_DATE_FORMATS,
        display: {
          monthYearLabel: 'MMM YYYY',
        },
        parse: {
          dateInput: 'DD/MM/YYYY'
        }
    }},
  ]
})
export class AngularMaterialModule { }

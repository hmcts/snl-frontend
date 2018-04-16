import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule, MatFormFieldModule,
  MatGridListModule,
  MatIconModule, MatInputModule, MatListModule,
  MatNativeDateModule, MatTableModule, MatToolbarModule
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
    MatTableModule
  ],
  declarations: []
})
export class AngularMaterialModule { }

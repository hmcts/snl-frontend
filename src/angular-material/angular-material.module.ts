import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule, MatFormFieldModule,
    MatGridListModule,
    MatIconModule, MatInputModule, MatListModule,
    MatNativeDateModule, MatSelectModule, MatSidenavModule, MatTableModule, MatToolbarModule
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

  ],
  declarations: []
})
export class AngularMaterialModule { }

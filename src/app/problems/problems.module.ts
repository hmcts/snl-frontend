import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemsTableComponent } from './components/problems-table/problems-table.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ProblemEffects } from './effects/problem.effects';
import { reducers } from './reducers';
import { ProblemsService } from './services/problems.service';
import { ProblemsPageComponent } from './containers/problems/problems-page.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    MatChipsModule,
    StoreModule.forFeature('problems', reducers),
    EffectsModule.forFeature([ProblemEffects])
  ],
  declarations: [ProblemsTableComponent, ProblemsPageComponent],
  providers: [ProblemsService]
})
export class ProblemsModule { }

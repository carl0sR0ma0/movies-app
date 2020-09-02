import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button';

import { MoviesRoutingModule } from './movies-routing.module';
import { MoviesComponent } from './movies.component';


@NgModule({
  declarations: [MoviesComponent],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class MoviesModule { }

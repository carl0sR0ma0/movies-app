import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DirectorsRoutingModule } from './directors-routing.module';
import { DirectorsComponent } from './directors.component';
import { ComponentsModule } from './../../components/components.module';
import { DirectorCardComponent } from './director-card/director-card.component';
import { DirectorDetailComponent } from './director-detail/director-detail.component';


@NgModule({
  declarations: [DirectorsComponent, DirectorCardComponent, DirectorDetailComponent],
  imports: [
    CommonModule,
    DirectorsRoutingModule,
    ComponentsModule,
    MatCardModule,
    FlexLayoutModule
  ]
})
export class DirectorsModule { }

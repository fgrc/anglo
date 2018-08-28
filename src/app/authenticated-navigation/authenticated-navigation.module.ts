import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AuthenticatedNavigationComponent } from './authenticated-navigation.component';
import { AngulaMaterialModule } from "../angular-material.module";

@NgModule({
  declarations:[
    AuthenticatedNavigationComponent
  ],
  imports:[
    CommonModule,
    RouterModule,
    AngulaMaterialModule
  ]
})
export class AuthenticatedNavigationModule { }

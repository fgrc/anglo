import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule} from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngulaMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations:[
    LoginComponent,
    SignupComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    AngulaMaterialModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}

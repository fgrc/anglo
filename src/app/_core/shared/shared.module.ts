//Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//Components
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';


//Routes


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([])
  ],
  exports: [
    LayoutComponent,
    CommonModule,
    RouterModule
  ],
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
  ]
})
export class SharedModule { }

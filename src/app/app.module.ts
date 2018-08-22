// Module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './_core/shared/shared.module'
import { StateStoreModule } from './_core/store/state.store.module'

import { VisualizationModule } from './visualization/visualization.module';

// Components
import { AppComponent } from './app.component';

//Routes
import { appRoutes } from './app.routes';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    RouterModule.forRoot(appRoutes),
    VisualizationModule,
    StateStoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

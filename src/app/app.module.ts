import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CountriesModule } from './countries/countries.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CountriesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

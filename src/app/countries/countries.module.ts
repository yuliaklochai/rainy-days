import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesStatComponent } from './countries-stat/countries-stat.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table'


@NgModule({
  declarations: [
    CountriesStatComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule
  ],
  exports: [
    CountriesStatComponent
  ]
})
export class CountriesModule { }

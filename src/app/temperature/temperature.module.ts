import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureComponent } from './temperature/temperature.component';


@NgModule({
  declarations: [TemperatureComponent],
  exports: [
    TemperatureComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TemperatureModule { }

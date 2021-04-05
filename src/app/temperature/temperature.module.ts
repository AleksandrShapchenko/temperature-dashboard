import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureComponent } from './temperature/temperature.component';
import { DisplayObjectComponent } from './display-object/display-object.component';
import { TemperatureRoutingModule } from './temperature-routing.module';

@NgModule({
  declarations: [TemperatureComponent, DisplayObjectComponent],
  exports: [TemperatureComponent],
  imports: [CommonModule, TemperatureRoutingModule]
})
export class TemperatureModule {}

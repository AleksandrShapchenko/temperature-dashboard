import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemperatureComponent } from './temperature/temperature.component';

const routes: Routes = [{ path: '', component: TemperatureComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemperatureRoutingModule {}

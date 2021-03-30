import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemperatureComponent } from './temperature/temperature/temperature.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'whether',
    pathMatch: 'full',
  },
  {
    path: 'whether',
    component: TemperatureComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

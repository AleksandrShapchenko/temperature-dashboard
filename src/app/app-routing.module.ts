import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'whether',
    pathMatch: 'full'
  },
  {
    path: 'whether',
    loadChildren: (): any =>
      import('./temperature/temperature.module').then(
        (m: any): any => m.TemperatureModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

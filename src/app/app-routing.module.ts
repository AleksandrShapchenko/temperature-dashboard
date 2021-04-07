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
  },
  {
    path: 'scrolling',
    loadChildren: (): any =>
      import('./scrolling/scrolling.module').then(
        (m: any): any => m.ScrollingModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

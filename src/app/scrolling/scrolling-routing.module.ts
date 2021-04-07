import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrollingComponent } from './scrolling/scrolling.component';

const routes: Routes = [{ path: '', component: ScrollingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScrollingRoutingModule {}

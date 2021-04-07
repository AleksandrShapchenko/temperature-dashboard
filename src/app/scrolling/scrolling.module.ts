import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingComponent } from './scrolling/scrolling.component';
import { RouterModule } from '@angular/router';
import { ScrollingRoutingModule } from './scrolling-routing.module';

@NgModule({
  declarations: [ScrollingComponent],
  exports: [ScrollingComponent],
  imports: [CommonModule, RouterModule, ScrollingRoutingModule]
})
export class ScrollingModule {}

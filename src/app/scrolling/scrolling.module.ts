import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingComponent } from './scrolling/scrolling.component';
import { RouterModule } from '@angular/router';
import { ScrollingRoutingModule } from './scrolling-routing.module';
import { VirtualScrollingComponent } from './virtual-scrolling/virtual-scrolling.component';

@NgModule({
  declarations: [ScrollingComponent, VirtualScrollingComponent],
  exports: [ScrollingComponent],
  imports: [CommonModule, RouterModule, ScrollingRoutingModule]
})
export class ScrollingModule {}

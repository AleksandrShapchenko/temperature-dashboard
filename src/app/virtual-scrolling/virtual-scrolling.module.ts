import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollingComponent } from './virtual-scrolling/virtual-scrolling.component';

@NgModule({
  declarations: [VirtualScrollingComponent],
  imports: [CommonModule],
  exports: [VirtualScrollingComponent]
})
export class VirtualScrollingModule {}

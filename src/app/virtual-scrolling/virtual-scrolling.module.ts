import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollService } from './virtual-scroll.service';
import { VirtualScrollingComponent } from './virtual-scrolling/virtual-scrolling.component';

@NgModule({
  declarations: [VirtualScrollingComponent],
  imports: [CommonModule],
  exports: [VirtualScrollingComponent],
  providers: [VirtualScrollService]
})
export class VirtualScrollingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDialogContainer } from './my-dialog-container';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MyDialogService } from './my-dialog.service';
import {
  MyDialogActions,
  MyDialogClose,
  MyDialogContent,
  MyDialogTitle
} from './my-dialog-directives';

@NgModule({
  declarations: [
    MyDialogContainer,
    MyDialogClose,
    MyDialogTitle,
    MyDialogContent,
    MyDialogActions
  ],
  imports: [CommonModule, PortalModule, OverlayModule],
  exports: [
    MyDialogContainer,
    MyDialogClose,
    MyDialogTitle,
    MyDialogContent,
    MyDialogActions
  ],
  providers: [MyDialogService]
})
export class MyDialogModule {}

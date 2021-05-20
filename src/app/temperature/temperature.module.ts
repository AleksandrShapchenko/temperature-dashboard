import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureComponent } from './temperature/temperature.component';
import { DisplayObjectComponent } from './display-object/display-object.component';
import { TemperatureRoutingModule } from './temperature-routing.module';
import { RouterModule } from '@angular/router';
import { ModalDialogModule } from '../modal-dialog';
import { MyDialogModule } from '../my-dialog';
import { MyDialogExampleComponent } from './my-dialog-example/my-dialog-example.component';

@NgModule({
  declarations: [
    TemperatureComponent,
    DisplayObjectComponent,
    MyDialogExampleComponent
  ],
  exports: [TemperatureComponent],
  imports: [
    CommonModule,
    TemperatureRoutingModule,
    RouterModule,
    ModalDialogModule,
    MyDialogModule
  ]
})
export class TemperatureModule {}

import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  GenerateDataService,
  generateDataServiceToken
} from './generate-data.service';

import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [CommonModule],
  providers: [
    { provide: generateDataServiceToken, useClass: GenerateDataService }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

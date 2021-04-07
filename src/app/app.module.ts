import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemperatureModule } from './temperature/temperature.module';
import { GenerateDataService } from './core/generate-data.service';
import { ScrollingModule } from './scrolling/scrolling.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TemperatureModule,
    ScrollingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useValue: (): GenerateDataService => new GenerateDataService(),
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

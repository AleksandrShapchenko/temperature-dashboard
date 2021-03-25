import { Component, OnInit } from '@angular/core';
import {GenerateDataService} from '../../core/generate-data.service';

@Component({
  selector: 'app-temperature-page',
  templateUrl: './temperature-page.component.html',
  styleUrls: ['./temperature-page.component.less']
})
export class TemperaturePageComponent implements OnInit {
  temperature: number | string | undefined;
  humidity: number | string | undefined;
  airPressure: number | string | undefined;

  temperatureObserver = {
    next: (temperature: number): void => {
      console.log(temperature);
      // this.temperature = interval <= 1000
      //   ? temperature
      //   : 'N/A';
    },
  };

  humidityObserver = {
    next: (humidity: number, interval: number) => {
      this.humidity = interval <= 1000
        ? humidity
        : 'N/A';
    }
  };

  airPressureObserver = {
    next: (airPressure: number, interval: number) => {
      this.airPressure = interval <= 1000
        ? airPressure
        : 'N/A';
    }
  };
  constructor(private dataService: GenerateDataService) { }

  ngOnInit(): void {
    // @ts-ignore
    const stream = this.dataService.currentTemperature.subscribe(this.temperatureObserver);

    setTimeout(() => {
      stream.unsubscribe();
    }, 10000);
  }


}

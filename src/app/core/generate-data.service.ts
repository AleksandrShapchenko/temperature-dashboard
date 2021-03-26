import { Injectable } from '@angular/core';
import {interval} from 'rxjs';

@Injectable()
export class GenerateDataService {
  temperature = 9;
  humidity = 40;
  airPressure = 10;

  private generateTemperature = new CustomEvent('generateTemperature');
  private generateHumidity = new CustomEvent('generateHumidity');
  private generateAirPressure = new CustomEvent('generateAirPressure');


  constructor() {
  }

  temperatureIntervalStream$ = interval(2000);
  humidityIntervalStream$ = interval(2000);
  airPressureIntervalStream$ = interval(2000);

  temperatureIntervalSubscribtion = this.temperatureIntervalStream$.subscribe((value) => {
    this.temperature = Math.random() < 0.5
      ? this.temperature += Math.round(Math.random() * 2)
      : this.temperature -= Math.round(Math.random() * 2);
    console.log('step: ', value);
    console.log('temperature: ', this.temperature);
    document.dispatchEvent(this.generateTemperature);
  });
  humidityIntervalSubscribtion = this.humidityIntervalStream$.subscribe((value) => {
    this.humidity = Math.random() < 0.5
      ? this.humidity += Math.round(Math.random() * 2)
      : this.humidity -= Math.round(Math.random() * 2);
    document.dispatchEvent(this.generateHumidity);
  });
  airPressureIntervalSubscribtion = this.airPressureIntervalStream$.subscribe((value) => {
    this.airPressure = Math.random() < 0.5
      ? this.airPressure += Math.round(Math.random() * 2)
      : this.airPressure -= Math.round(Math.random() * 2);
    document.dispatchEvent(this.generateAirPressure);
  });
}

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class GenerateDataService {
  private temperature = 0;
  private humidity = 0;
  private airPressure = 0;

  private generateTemperature = new CustomEvent('generateTemper', {
    detail: {
      temperature: this.temperature = Math.random() < 0.5
        ? this.temperature += Math.floor(Math.random() * 2)
        : this.temperature -= Math.floor(Math.random() * 2)
    }
  });
  private generateHumidity = new CustomEvent('generateHumidity', {
    detail: this.humidity = Math.random() < 0.5
      ? this.humidity += Math.floor(Math.random() * 2)
      : this.humidity -= Math.floor(Math.random() * 2)
  });
  private generateAirPressure = new CustomEvent('generateAirPressure', {
    detail: this.airPressure = Math.random() < 0.5
      ? this.airPressure += Math.floor(Math.random() * 2)
      : this.airPressure -= Math.floor(Math.random() * 2)
  });


  constructor() { }

  currentTemperature = new Observable(subscriber => {
    let randomInterval = 0;
    setInterval(() => {
      randomInterval = 100 + Math.random() * 1900;
      document.dispatchEvent(this.generateTemperature);
      subscriber.next(randomInterval);
    }, randomInterval);
  });
  currentHumidity = new Observable(subscriber => {
    setInterval(() => {
      subscriber.next(document.dispatchEvent(this.generateHumidity));
    }, 100 + Math.random() * 1900);
  });
  currentAirPressure = new Observable(subscriber => {
    setInterval(() => {
      subscriber.next(document.dispatchEvent(this.generateAirPressure));
    }, 100 + Math.random() * 1900);
  });
}

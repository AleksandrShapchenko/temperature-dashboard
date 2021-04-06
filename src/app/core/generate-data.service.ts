import { Injectable } from '@angular/core';

import { Canceller } from '../shared/models/canceller';

@Injectable({
  providedIn: 'root'
})
export class GenerateDataService {
  public airPressure: number = 10;
  public humidity: number = 40;
  public temperature: number = 9;

  public constructor() {}

  private generateAirPressure = (): void => {
    const half: number = 0.5;
    const positive: boolean = Math.random() < half;
    this.airPressure = positive
      ? (this.airPressure += Math.round(Math.random()))
      : (this.airPressure -= Math.round(Math.random()));
    document.dispatchEvent(
      new CustomEvent('generateAirPressure', {
        detail: {
          airPressure: this.airPressure
        }
      })
    );
  };
  private generateHumidity = (): void => {
    const half: number = 0.5;
    const positive: boolean = Math.random() < half;
    this.humidity = positive
      ? (this.humidity += Math.round(Math.random()))
      : (this.humidity -= Math.round(Math.random()));
    document.dispatchEvent(
      new CustomEvent('generateHumidity', {
        detail: {
          humidity: this.humidity
        }
      })
    );
  };

  private generateTemperature = (): void => {
    const half: number = 0.5;
    const positive: boolean = Math.random() < half;
    this.temperature = positive
      ? (this.temperature += Math.round(Math.random()))
      : (this.temperature -= Math.round(Math.random()));
    document.dispatchEvent(
      new CustomEvent('generateTemperature', {
        detail: {
          temperature: this.temperature
        }
      })
    );
  };

  private planAhead(callback: () => void): Canceller {
    const minDuration: number = 100;
    const maxDuration: number = 1900;
    const timeout: ReturnType<typeof setTimeout> = setTimeout((): void => {
      callback();
      this.planAhead(callback);
    }, minDuration + Math.random() * maxDuration);

    return (): void => {
      clearTimeout(timeout);
    };
  }

  public airPressureStream = this.planAhead(this.generateAirPressure);
  public humidityStream = this.planAhead(this.generateHumidity);
  public temperatureStream = this.planAhead(this.generateTemperature);
}

import { Injectable } from '@angular/core';

import { Canceller } from '../shared/models/canceller';

@Injectable()
export class GenerateDataService {
  public airPressure: number = 10;
  public humidity: number = 40;
  public temperature: number = 9;

  private generateAirPressureEvent: CustomEvent = new CustomEvent(
    'generateAirPressure',
    {
      detail: {
        airPressure: this.airPressure,
      },
    }
  );
  private generateHumidityEvent: CustomEvent = new CustomEvent(
    'generateHumidity',
    {
      detail: {
        humidity: this.humidity,
      },
    }
  );

  private generateTemperatureEvent: CustomEvent = new CustomEvent(
    'generateTemperature',
    {
      detail: {
        temperature: this.temperature,
      },
    }
  );

  public constructor() {}

  private generateAirPressure = (): void => {
    const half: number = 0.5;
    const positive: boolean = Math.random() < half;
    this.airPressure = positive
      ? (this.airPressure += Math.round(Math.random()))
      : (this.airPressure -= Math.round(Math.random()));
    document.dispatchEvent(this.generateAirPressureEvent);
  };
  private generateHumidity = (): void => {
    const half: number = 0.5;
    const positive: boolean = Math.random() < half;
    this.humidity = positive
      ? (this.humidity += Math.round(Math.random()))
      : (this.humidity -= Math.round(Math.random()));
    document.dispatchEvent(this.generateHumidityEvent);
  };

  private generateTemperature = (): void => {
    const half: number = 0.5;
    const positive: boolean = Math.random() < half;
    this.temperature = positive
      ? (this.temperature += Math.round(Math.random()))
      : (this.temperature -= Math.round(Math.random()));
    document.dispatchEvent(this.generateTemperatureEvent);
  };

  private planAhead(callback: () => void): Canceller {
    const minDuration: number = 100;
    const maxDuration: number = 1900;
    const timeout: ReturnType<typeof setTimeout> = setTimeout((): void => {
      callback();
      console.log('planAhead');
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

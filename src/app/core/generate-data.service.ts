import {Injectable} from '@angular/core';
import {Canceller} from '../shared/models/canceller';

@Injectable()
export class GenerateDataService {

  constructor() {
  }

  public temperature = 9;
  public humidity = 40;
  public airPressure = 10;

  private generateTemperatureEvent = new CustomEvent('generateTemperature', {
    detail: {
      temperature: this.temperature
    }
  });
  private generateHumidityEvent = new CustomEvent('generateHumidity', {
    detail: {
      humidity: this.humidity
    }
  });
  private generateAirPressureEvent = new CustomEvent('generateAirPressure', {
    detail: {
      airPressure: this.airPressure
    }
  });

  private generateTemperature = () => {
    this.temperature = Math.random() < 0.5
      ? this.temperature += Math.round(Math.random())
      : this.temperature -= Math.round(Math.random());
    document.dispatchEvent(this.generateTemperatureEvent);
  }
  private generateHumidity = () => {
    this.humidity = Math.random() < 0.5
      ? this.humidity += Math.round(Math.random())
      : this.humidity -= Math.round(Math.random());
    document.dispatchEvent(this.generateHumidityEvent);
  }
  private generateAirPressure = () => {
    this.airPressure = Math.random() < 0.5
      ? this.airPressure += Math.round(Math.random())
      : this.airPressure -= Math.round(Math.random());
    document.dispatchEvent(this.generateAirPressureEvent);
  }

  private planAhead(callback: () => void): Canceller {
    const timeout = setTimeout(() => {
      callback();
      this.planAhead(callback);
    }, 100 + Math.random() * 1900);

    return function canceller(): void {
      clearTimeout(timeout);
    };
  }

  public temperatureStream = this.planAhead(this.generateTemperature);
  public humidityStream = this.planAhead(this.generateHumidity);
  public airPressureStream = this.planAhead(this.generateAirPressure);
}

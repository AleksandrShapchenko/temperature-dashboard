import {Injectable} from '@angular/core';
import {Canceller} from '../shared/models/canceller';
import set = Reflect.set;

@Injectable()
export class GenerateDataService {

  constructor() {
  }

  temperature = 9;
  humidity = 40;
  airPressure = 10;

  private generateTemperatureEvent = new CustomEvent('generateTemperature');
  private generateHumidityEvent = new CustomEvent('generateHumidity');
  private generateAirPressureEvent = new CustomEvent('generateAirPressure');

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

  planAhead(callback: () => void): Canceller {
    let work = true;
    setTimeout(() => {
      callback();
      if (work) {
        this.planAhead(callback);
      }
    }, 100 + Math.random() * 1900);

    return function canceller(): void {
      work = false;
    };
  }



  temperatureStream = this.planAhead(this.generateTemperature);
  humidityStream = this.planAhead(this.generateHumidity);
  airPressureStream = this.planAhead(this.generateAirPressure);

}

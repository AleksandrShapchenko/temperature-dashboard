import {Component, OnInit} from '@angular/core';
import {GenerateDataService} from '../../core/generate-data.service';
import {fromEvent, merge} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.less']
})
export class TemperatureComponent implements OnInit {

  constructor(private dataService: GenerateDataService) {
  }

  ngOnInit(): void {
    const maxEventDelay = 1000;
    const minEmitDelay = 100;
    let temperaturePreviousEventTime = Date.now();
    let humidityPreviousEventTime = Date.now();
    let airPressurePreviousEventTime = Date.now();
    let previousEmitTime = Date.now();

    let lastTimeTemperature: number | string;
    let lastTimeHumidity: number | string;
    let lastTimeAirPressure: number | string;

    const temperatureEventStream = fromEvent(document, 'generateTemperature');
    const humidityEventStream = fromEvent(document, 'generateHumidity');
    const airPressureEventStream = fromEvent(document, 'generateAirPressure');

    const whetherDataEventsStream = merge(
      temperatureEventStream.pipe(map(e => {
        const delayFromPreviousEvent = Date.now() - temperaturePreviousEventTime;
        const currentTemperature = delayFromPreviousEvent > maxEventDelay
          ? 'N/A'
          : (e as CustomEvent).detail.temperature;
        temperaturePreviousEventTime = Date.now();
        return {
          temperature: currentTemperature,
          humidity: lastTimeHumidity,
          airPressure: lastTimeAirPressure
        };
      })),


      humidityEventStream.pipe(map(e => {
        const delayFromPreviousEvent = Date.now() - humidityPreviousEventTime;
        const currentHumidity = delayFromPreviousEvent > maxEventDelay
          ? 'N/A'
          : (e as CustomEvent).detail.humidity;
        humidityPreviousEventTime = Date.now();
        return {
          temperature: lastTimeTemperature,
          humidity: currentHumidity,
          airPressure: lastTimeAirPressure
        };
      })),

      airPressureEventStream.pipe(map(e => {
        const delayFromPreviousEvent = Date.now() - airPressurePreviousEventTime;
        const currentAirPressure = delayFromPreviousEvent > maxEventDelay
          ? 'N/A'
          : (e as CustomEvent).detail.airPressure;
        airPressurePreviousEventTime = Date.now();
        return {
          temperature: lastTimeTemperature,
          humidity: lastTimeHumidity,
          airPressure: currentAirPressure
        };
      })),
    );

    whetherDataEventsStream.subscribe(data => {
      const moreThanMinEmitDelay = Date.now() - previousEmitTime > minEmitDelay;

      if (moreThanMinEmitDelay) {
        previousEmitTime = Date.now();
        lastTimeTemperature = data.temperature;
        lastTimeHumidity = data.humidity;
        lastTimeAirPressure = data.airPressure;
        console.log('from subscription: ', data);
      } else {
        console.log('less than minEmitDelay(100ms)', Date.now() - previousEmitTime);
      }
    });
  }
}

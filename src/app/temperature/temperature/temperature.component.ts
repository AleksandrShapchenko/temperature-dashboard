import { Component, OnInit } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DisplayObject } from '../../shared/models/display-object';
import { GenerateDataService } from '../../core/generate-data.service';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.less'],
})
export class TemperatureComponent implements OnInit {
  public isFormed: boolean = false;
  public displayObject: DisplayObject = {
    temperature: undefined,
    humidity: undefined,
    airPressure: undefined,
  };

  public constructor(private dataService: GenerateDataService) {}

  public ngOnInit(): void {
    const maxEventDelay: number = 1000;
    const minEmitDelay: number = 100;
    let temperaturePreviousEventTime: number = Date.now();
    let humidityPreviousEventTime: number = Date.now();
    let airPressurePreviousEventTime: number = Date.now();
    let previousEmitTime: number = Date.now();

    let lastTimeTemperature: number | string | undefined;
    let lastTimeHumidity: number | string | undefined;
    let lastTimeAirPressure: number | string | undefined;

    const temperatureEventStream: Observable<Event> = fromEvent(
      document,
      'generateTemperature'
    );
    const humidityEventStream: Observable<Event> = fromEvent(
      document,
      'generateHumidity'
    );
    const airPressureEventStream: Observable<Event> = fromEvent(
      document,
      'generateAirPressure'
    );

    const whetherDataEventsStream: Observable<DisplayObject> = merge(
      temperatureEventStream.pipe(
        map(
          (e: Event): DisplayObject => {
            const delayFromPreviousEvent: number =
              Date.now() - temperaturePreviousEventTime;
            const currentTemperature: number | string =
              delayFromPreviousEvent > maxEventDelay
                ? 'N/A'
                : (e as CustomEvent).detail.temperature;
            temperaturePreviousEventTime = Date.now();

            return {
              temperature: currentTemperature,
              humidity: lastTimeHumidity,
              airPressure: lastTimeAirPressure,
            };
          }
        )
      ),

      humidityEventStream.pipe(
        map(
          (e: Event): DisplayObject => {
            const delayFromPreviousEvent: number =
              Date.now() - humidityPreviousEventTime;
            const currentHumidity: number | string =
              delayFromPreviousEvent > maxEventDelay
                ? 'N/A'
                : (e as CustomEvent).detail.humidity;
            humidityPreviousEventTime = Date.now();

            return {
              temperature: lastTimeTemperature,
              humidity: currentHumidity,
              airPressure: lastTimeAirPressure,
            };
          }
        )
      ),

      airPressureEventStream.pipe(
        map(
          (e: Event): DisplayObject => {
            const delayFromPreviousEvent: number =
              Date.now() - airPressurePreviousEventTime;
            const currentAirPressure: number | string =
              delayFromPreviousEvent > maxEventDelay
                ? 'N/A'
                : (e as CustomEvent).detail.airPressure;
            airPressurePreviousEventTime = Date.now();

            return {
              temperature: lastTimeTemperature,
              humidity: lastTimeHumidity,
              airPressure: currentAirPressure,
            };
          }
        )
      )
    );

    whetherDataEventsStream.subscribe((data: DisplayObject): void => {
      const moreThanMinEmitDelay: boolean =
        Date.now() - previousEmitTime > minEmitDelay;
      if (moreThanMinEmitDelay) {
        previousEmitTime = Date.now();
        lastTimeTemperature = data.temperature;
        lastTimeHumidity = data.humidity;
        lastTimeAirPressure = data.airPressure;
        if (
          lastTimeTemperature !== undefined &&
          lastTimeHumidity !== undefined &&
          lastTimeAirPressure !== undefined
        ) {
          this.isFormed = true;
          this.displayObject = data;
        }
      }
    });
  }
}

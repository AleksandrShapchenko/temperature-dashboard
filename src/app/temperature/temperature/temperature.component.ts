import { Component, OnInit } from '@angular/core';
import { combineLatest, fromEvent, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { GenerateDataService } from '../../core/generate-data.service';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.less'],
})
export class TemperatureComponent implements OnInit {
  public displayObject:
    | Observable<[string | number, string | number, string | number]>
    | undefined;

  public constructor(private dataService: GenerateDataService) {}

  public ngOnInit(): void {
    const maxEventDelay: number = 1000;
    const minPreviousEmitTime: number = 100;
    let temperaturePreviousEventTime: number = Date.now();
    let humidityPreviousEventTime: number = Date.now();
    let airPressurePreviousEventTime: number = Date.now();

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

    this.displayObject = combineLatest([
      temperatureEventStream.pipe(
        map((e: Event): string | number => {
          const delayFromPreviousEvent: number =
            Date.now() - temperaturePreviousEventTime;
          const temperature: number | string =
            delayFromPreviousEvent > maxEventDelay
              ? 'N/A'
              : (e as CustomEvent).detail.temperature;
          temperaturePreviousEventTime = Date.now();

          return temperature;
        })
      ),

      humidityEventStream.pipe(
        map((e: Event): string | number => {
          const delayFromPreviousEvent: number =
            Date.now() - humidityPreviousEventTime;
          const humidity: number | string =
            delayFromPreviousEvent > maxEventDelay
              ? 'N/A'
              : (e as CustomEvent).detail.humidity;
          humidityPreviousEventTime = Date.now();

          return humidity;
        })
      ),

      airPressureEventStream.pipe(
        map((e: Event): string | number => {
          const delayFromPreviousEvent: number =
            Date.now() - airPressurePreviousEventTime;
          const airPressure: number | string =
            delayFromPreviousEvent > maxEventDelay
              ? 'N/A'
              : (e as CustomEvent).detail.airPressure;
          airPressurePreviousEventTime = Date.now();

          return airPressure;
        })
      ),
    ]).pipe(debounceTime(minPreviousEmitTime));
  }
}

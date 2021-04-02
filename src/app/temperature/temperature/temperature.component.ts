import { Component, OnInit } from '@angular/core';
import { combineLatest, fromEvent, Observable } from 'rxjs';
import { debounceTime, map, pairwise } from 'rxjs/operators';

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
    const minPreviousEmitTime: number = 100;

    const temperatureEventStream: Observable<CustomEvent> = fromEvent<CustomEvent>(
      document,
      'generateTemperature'
    );
    const humidityEventStream: Observable<CustomEvent> = fromEvent<CustomEvent>(
      document,
      'generateHumidity'
    );
    const airPressureEventStream: Observable<CustomEvent> = fromEvent<CustomEvent>(
      document,
      'generateAirPressure'
    );

    this.displayObject = combineLatest([
      temperatureEventStream.pipe(
        pairwise<CustomEvent>(),
        map((eventPair: CustomEvent[]): string | number => {
          const maxEventDelay: number = 1000;
          const previousEvent: CustomEvent = eventPair[0];
          const currentEvent: CustomEvent = eventPair[1];
          const delayFromPreviousEvent: number =
            currentEvent.timeStamp - previousEvent.timeStamp;

          return delayFromPreviousEvent > maxEventDelay
            ? 'N/A'
            : currentEvent.detail.temperature;
        })
      ),

      humidityEventStream.pipe(
        pairwise(),
        map((eventPair: CustomEvent[]): string | number => {
          const maxEventDelay: number = 1000;
          const previousEvent: CustomEvent = eventPair[0];
          const currentEvent: CustomEvent = eventPair[1];
          const delayFromPreviousEvent: number =
            currentEvent.timeStamp - previousEvent.timeStamp;

          return delayFromPreviousEvent > maxEventDelay
            ? 'N/A'
            : currentEvent.detail.humidity;
        })
      ),

      airPressureEventStream.pipe(
        pairwise(),
        map((eventPair: CustomEvent[]): string | number => {
          const maxEventDelay: number = 1000;
          const previousEvent: CustomEvent = eventPair[0];
          const currentEvent: CustomEvent = eventPair[1];
          const delayFromPreviousEvent: number =
            currentEvent.timeStamp - previousEvent.timeStamp;

          return delayFromPreviousEvent > maxEventDelay
            ? 'N/A'
            : currentEvent.detail.airPressure;
        })
      ),
    ]).pipe(debounceTime(minPreviousEmitTime));
  }
}

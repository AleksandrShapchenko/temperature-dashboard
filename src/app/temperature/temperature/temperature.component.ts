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
        pairwise(),
        map((eventPair: Event[]): string | number => {
          const maxEventDelay: number = 1000;
          const previousEvent: Event = eventPair[0];
          const currentEvent: Event = eventPair[1];
          const delayFromPreviousEvent: number =
            currentEvent.timeStamp - previousEvent.timeStamp;

          return delayFromPreviousEvent > maxEventDelay
            ? 'N/A'
            : (currentEvent as CustomEvent).detail.temperature;
        })
      ),

      humidityEventStream.pipe(
        pairwise(),
        map((eventPair: Event[]): string | number => {
          const maxEventDelay: number = 1000;
          const previousEvent: Event = eventPair[0];
          const currentEvent: Event = eventPair[1];
          const delayFromPreviousEvent: number =
            currentEvent.timeStamp - previousEvent.timeStamp;

          return delayFromPreviousEvent > maxEventDelay
            ? 'N/A'
            : (currentEvent as CustomEvent).detail.humidity;
        })
      ),

      airPressureEventStream.pipe(
        pairwise(),
        map((eventPair: Event[]): string | number => {
          const maxEventDelay: number = 1000;
          const previousEvent: Event = eventPair[0];
          const currentEvent: Event = eventPair[1];
          const delayFromPreviousEvent: number =
            currentEvent.timeStamp - previousEvent.timeStamp;

          return delayFromPreviousEvent > maxEventDelay
            ? 'N/A'
            : (currentEvent as CustomEvent).detail.airPressure;
        })
      ),
    ]).pipe(debounceTime(minPreviousEmitTime));
  }
}

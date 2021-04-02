import { Component, OnInit } from '@angular/core';
import { combineLatest, fromEvent, Observable } from 'rxjs';
import { debounceTime, map, pairwise } from 'rxjs/operators';

import { GenerateDataService } from '../../core/generate-data.service';
import { DisplayObject } from '../../shared/models/display-object';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.less'],
})
export class TemperatureComponent implements OnInit {
  public displayObject: Observable<DisplayObject> | undefined;

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
        map(mapDataFromEvent('temperature'))
      ),

      humidityEventStream.pipe(
        pairwise(),
        map(mapDataFromEvent('humidity'))
      ),

      airPressureEventStream.pipe(
        pairwise(),
        map(mapDataFromEvent('airPressure'))
      ),
    ]).pipe(
      map(
        (dataArray: (string | number)[]): DisplayObject => {
          return {
            temperature: dataArray[0],
            humidity: dataArray[1],
            airPressure: dataArray[2],
          };
        }
      ),
      debounceTime(minPreviousEmitTime)
    );

    function mapDataFromEvent(
      propertyName: string
    ): (eventPair: CustomEvent[]) => string | number {
      return (eventPair: CustomEvent[]): string | number => {
        const maxEventDelay: number = 1000;
        const previousEvent: CustomEvent = eventPair[0];
        const currentEvent: CustomEvent = eventPair[1];
        const delayFromPreviousEvent: number =
          currentEvent.timeStamp - previousEvent.timeStamp;

        return delayFromPreviousEvent > maxEventDelay
          ? 'N/A'
          : currentEvent.detail[propertyName];
      };
    }
  }
}
